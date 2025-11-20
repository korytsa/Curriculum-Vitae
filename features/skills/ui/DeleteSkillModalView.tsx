"use client";

import { useTranslation } from "react-i18next";
import { Modal } from "@/shared/ui";
import type { FormikProps } from "formik";

interface DeleteSkillFormValues {
  skillId: string;
}

interface DeleteSkillModalViewProps {
  formik: FormikProps<DeleteSkillFormValues>;
  allSkillsForSelect: Array<{ id: string; name: string }>;
  error: Error | undefined;
  loading: boolean;
  open: boolean;
  showConfirm: boolean;
  selectedSkillName: string | undefined;
  onCancel: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onClose: () => void;
}

export function DeleteSkillModalView({
  formik,
  allSkillsForSelect,
  error,
  loading,
  open,
  showConfirm,
  selectedSkillName,
  onCancel,
  onDelete,
  onConfirmDelete,
  onClose,
}: DeleteSkillModalViewProps) {
  const { t } = useTranslation();

  if (showConfirm) {
    return (
      <Modal
        open={open}
        onClose={onCancel}
        title={t("features.skills.deleteModal.confirmTitle")}
        primaryAction={{
          label: t("features.skills.common.confirm"),
          onClick: onConfirmDelete,
          disabled: loading,
        }}
        secondaryAction={{
          label: t("features.skills.common.cancel"),
          onClick: () => onCancel(),
        }}
      >
        <p className="text-white/80 mb-4">
          {t("features.skills.deleteModal.warning")}
        </p>
        {selectedSkillName && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">
              {t("features.skills.deleteModal.labels.skillToDelete")}
            </div>
            <div className="text-white font-semibold">{selectedSkillName}</div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm mt-4">
            {error.message}
          </div>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("features.skills.deleteModal.title")}
      primaryAction={{
        label: t("features.skills.deleteModal.delete"),
        onClick: onDelete,
        disabled: !formik.values.skillId || !formik.isValid,
      }}
      secondaryAction={{
        label: t("features.skills.common.cancel"),
        onClick: () => {
          formik.resetForm();
          onClose();
        },
      }}
    >
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm mb-4">
          {error.message}
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="skillId"
          className="text-xs uppercase tracking-[0.2em] text-gray-400"
        >
          {t("features.skills.deleteModal.labels.skill")}
        </label>
        <select
          id="skillId"
          {...formik.getFieldProps('skillId')}
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
    </Modal>
  );
}

