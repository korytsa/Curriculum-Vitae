"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { FormStatus, Modal } from "@/shared/ui";
import { useDeleteSkill } from "../model/useDeleteSkill";
import type { DeleteSkillPayload } from "../model/useDeleteSkill";

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
  const { t } = useTranslation();

  const initialValues: DeleteSkillFormValues = {
    skillId: "",
  };

  const validate = (values: DeleteSkillFormValues) => {
    const errors: Partial<DeleteSkillFormValues> = {};

    if (!values.skillId) {
      errors.skillId = t("features.skills.deleteModal.errors.skillRequired");
    }

    return errors;
  };

  const mapValuesToPayload = (values: DeleteSkillFormValues): DeleteSkillPayload | null => {
    if (!values.skillId) {
      return null;
    }

    return {
      skillId: values.skillId,
    };
  };

  const formik = useFormik<DeleteSkillFormValues>({
    initialValues,
    validate,
    onSubmit: async (values, helpers) => {
      const payload = mapValuesToPayload(values);
      if (!payload) return;

      try {
        await deleteSkill(payload);
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
    <Modal
      open={open}
      onClose={handleCancel}
      title={
        showConfirm
          ? t("features.skills.deleteModal.confirmTitle")
          : t("features.skills.deleteModal.title")
      }
      primaryAction={{
        label: showConfirm ? t("features.skills.common.confirm") : t("features.skills.deleteModal.delete"),
        onClick: showConfirm ? handleConfirmDelete : handleDelete,
        disabled: loading || (!showConfirm && (!formik.values.skillId || !formik.isValid)),
      }}
      secondaryAction={{
        label: t("features.skills.common.cancel"),
        onClick: showConfirm ? handleCancel : () => {
          formik.resetForm();
          onClose();
        },
      }}
    >
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

      {showConfirm ? (
        <div className="space-y-4">
          <p className="text-white/80">
            {t("features.skills.deleteModal.warning")}
          </p>

          {selectedSkill ? (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">
                {t("features.skills.deleteModal.labels.skillToDelete")}
              </div>
              <div className="text-white font-semibold">{selectedSkill.name}</div>
            </div>
          ) : (
            <p className="text-sm text-red-400">
              {t("features.skills.deleteModal.errors.skillRequired")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label
            htmlFor="skillId"
            className="text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            {t("features.skills.deleteModal.labels.skill")}
          </label>
          <select
            id="skillId"
            {...formik.getFieldProps("skillId")}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="" className="text-black">
              {t("features.skills.deleteModal.placeholders.skill")}
            </option>
            {allSkillsForSelect.map((skill) => (
              <option key={skill.id} value={skill.id} className="text-black">
                {skill.name}
              </option>
            ))}
          </select>
          {formik.touched.skillId && formik.errors.skillId ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.skillId}</p>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

