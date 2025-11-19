'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { useDeleteSkill } from '../model/useDeleteSkill';
import { DeleteSkillModalView } from './DeleteSkillModalView';

interface DeleteSkillFormValues {
  skillId: string;
}

interface DeleteSkillModalProps {
  open: boolean;
  allSkillsForSelect: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteSkillModal({
  open,
  allSkillsForSelect,
  onClose,
  onSuccess,
}: DeleteSkillModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteSkill, loading, error } = useDeleteSkill();

  const formik = useFormik<DeleteSkillFormValues>({
    initialValues: {
      skillId: '',
    },
    validate: (values) => {
      const errors: Partial<DeleteSkillFormValues> = {};

      if (!values.skillId) {
        errors.skillId = 'Please select a skill to delete';
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      if (!values.skillId) return;

      try {
        await deleteSkill(values.skillId);
        helpers.resetForm();
        setShowConfirm(false);
        onSuccess();
        onClose();
      } catch (err) {
        console.error('Error deleting skill:', err);
      }
    },
  });

  const handleDelete = () => {
    if (!formik.values.skillId) {
      formik.setFieldTouched('skillId', true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setShowConfirm(false);
    formik.resetForm();
  };

  const selectedSkill = allSkillsForSelect.find((s) => s.id === formik.values.skillId);

  return (
    <DeleteSkillModalView
      formik={formik}
      allSkillsForSelect={allSkillsForSelect}
      error={error}
      loading={loading}
      open={open}
      showConfirm={showConfirm}
      selectedSkillName={selectedSkill?.name}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onConfirmDelete={handleConfirmDelete}
      onClose={onClose}
    />
  );
}

