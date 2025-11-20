"use client";

import { useTranslation } from "react-i18next";
import { Input, Modal } from "@/shared/ui";
import type { FormikProps } from "formik";
import type { CategoryOption } from "../model/types";

interface AddSkillFormValues {
  skillName: string;
  categoryId: string;
}

interface AddSkillFormViewProps {
  formik: FormikProps<AddSkillFormValues>;
  categoryOptions: CategoryOption[];
  error: Error | undefined;
  loading: boolean;
  open: boolean;
  onCancel: () => void;
}

export function AddSkillFormView({
  formik,
  categoryOptions,
  error,
  loading,
  open,
  onCancel,
}: AddSkillFormViewProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t("features.skills.addForm.title")}
      primaryAction={{
        label: t("features.skills.common.confirm"),
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting,
      }}
      secondaryAction={{
        label: t("features.skills.common.cancel"),
        onClick: () => {
          formik.resetForm();
          onCancel();
        },
      }}
    >
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm mb-4">
          {error.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Input
            id="skillName"
            label={t("features.skills.addForm.labels.name")}
            placeholder={t("features.skills.addForm.placeholders.name")}
            {...formik.getFieldProps('skillName')}
            required
          />
          {formik.touched.skillName && formik.errors.skillName ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.skillName}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="categoryId"
            className="text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            {t("features.skills.addForm.labels.category")}
          </label>
          <select
            id="categoryId"
            {...formik.getFieldProps('categoryId')}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id} className="text-black">
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.categoryId}</p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

