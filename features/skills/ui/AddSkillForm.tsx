'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { useCreateSkill } from '../model/useCreateSkill';
import { AddSkillFormView } from './AddSkillFormView';
import type { CategoryOption } from '../model/types';

interface AddSkillFormValues {
  skillName: string;
  categoryId: string;
}

interface AddSkillFormProps {
  open: boolean;
  categoryOptions: CategoryOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddSkillForm({
  open,
  categoryOptions,
  onSuccess,
  onCancel,
}: AddSkillFormProps) {
  const { createSkill, loading, error } = useCreateSkill();

  const formik = useFormik<AddSkillFormValues>({
    initialValues: {
      skillName: '',
      categoryId: categoryOptions.length > 0 ? categoryOptions[0].id : '',
    },
    validate: (values) => {
      const errors: Partial<AddSkillFormValues> = {};

      if (!values.skillName.trim()) {
        errors.skillName = 'Skill name is required';
      }

      if (!values.categoryId) {
        errors.categoryId = 'Category is required';
      } else {
        const categoryIdNum = parseInt(values.categoryId, 10);
        if (isNaN(categoryIdNum)) {
          errors.categoryId = 'Invalid category ID';
        }
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      const categoryIdNum = parseInt(values.categoryId, 10);
      if (isNaN(categoryIdNum)) {
        return;
      }

      try {
        await createSkill(values.skillName.trim(), categoryIdNum);
        helpers.resetForm();
        onSuccess();
      } catch (err) {
      }
    },
  });

  useEffect(() => {
    if (!formik.values.categoryId && categoryOptions.length > 0) {
      formik.setFieldValue('categoryId', categoryOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryOptions]);

  return (
    <AddSkillFormView
      formik={formik}
      categoryOptions={categoryOptions}
      error={error}
      loading={loading}
      open={open}
      onCancel={onCancel}
    />
  );
}

