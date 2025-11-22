"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Input, Modal, FormStatus } from "@/shared/ui";
import { useCreateSkill } from "../model/useCreateSkill";
import type { CreateSkillPayload } from "../model/useCreateSkill";
import type { CategoryOption } from "../model/types";

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
  const { t } = useTranslation();

  const initialValues: AddSkillFormValues = {
    skillName: "",
    categoryId: categoryOptions.length > 0 ? categoryOptions[0].id : "",
  };

  const validate = (values: AddSkillFormValues) => {
    const errors: Partial<AddSkillFormValues> = {};

    if (!values.skillName.trim()) {
      errors.skillName = t("features.skills.addForm.errors.nameRequired");
    }

    if (!values.categoryId) {
      errors.categoryId = t("features.skills.addForm.errors.categoryRequired");
    } else {
      const categoryIdNum = parseInt(values.categoryId, 10);
      if (isNaN(categoryIdNum)) {
        errors.categoryId = t("features.skills.addForm.errors.categoryInvalid");
      }
    }

    return errors;
  };

  const mapValuesToPayload = (
    values: AddSkillFormValues
  ): CreateSkillPayload | null => {
    if (!values.skillName.trim()) {
      return null;
    }

    const categoryId = parseInt(values.categoryId, 10);
    if (isNaN(categoryId)) {
      return null;
    }

    return {
      name: values.skillName.trim(),
      categoryId: String(categoryId),
    };
  };

  const formik = useFormik<AddSkillFormValues>({
    initialValues,
    validate,
    onSubmit: async (values, helpers) => {
      const payload = mapValuesToPayload(values);
      if (!payload) {
        return;
      }

      try {
        await createSkill(payload);
        helpers.resetForm();
        onSuccess();
      } catch (err) {
        // handled by hook error
      }
    },
  });

  useEffect(() => {
    if (!formik.values.categoryId && categoryOptions.length > 0) {
      formik.setFieldValue("categoryId", categoryOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryOptions]);

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
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

      <div className="space-y-4">
        <div>
          <Input
            id="skillName"
            label={t("features.skills.addForm.labels.name")}
            placeholder={t("features.skills.addForm.placeholders.name")}
            {...formik.getFieldProps("skillName")}
            required
          />
          {formik.touched.skillName && formik.errors.skillName ? (
            <p className="mt-1 text-sm text-red-400">
              {formik.errors.skillName}
            </p>
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
            {...formik.getFieldProps("categoryId")}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categoryOptions.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="text-black"
              >
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId ? (
            <p className="mt-1 text-sm text-red-400">
              {formik.errors.categoryId}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
