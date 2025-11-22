"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Input, Modal, FormStatus } from "@/shared/ui";
import { useUpdateSkill } from "../model/useUpdateSkill";
import type { UpdateSkillPayload } from "../model/useUpdateSkill";
import type { CategoryOption, SkillCategory } from "../model/types";

interface UpdateSkillFormValues {
  skillId: string;
  skillName: string;
  categoryId: string;
}

interface UpdateSkillFormProps {
  open: boolean;
  categoryOptions: CategoryOption[];
  displayCategories: SkillCategory[];
  allSkillsForSelect: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UpdateSkillForm({
  open,
  categoryOptions,
  displayCategories,
  allSkillsForSelect,
  onSuccess,
  onCancel,
}: UpdateSkillFormProps) {
  const { updateSkill, loading, error } = useUpdateSkill();
  const initialValues: UpdateSkillFormValues = {
    skillId: "",
    skillName: "",
    categoryId: "",
  };
  const { t } = useTranslation();

  const validate = (values: UpdateSkillFormValues) => {
    const errors: Partial<UpdateSkillFormValues> = {};

    if (!values.skillId) {
      errors.skillId = t("features.skills.updateForm.errors.skillRequired");
    }

    if (!values.skillName.trim()) {
      errors.skillName = t("features.skills.updateForm.errors.nameRequired");
    }

    if (values.categoryId) {
      const categoryIdNum = parseInt(values.categoryId, 10);
      if (isNaN(categoryIdNum)) {
        errors.categoryId = t("features.skills.updateForm.errors.categoryInvalid");
      }
    }

    return errors;
  };

  const mapValuesToPayload = (
    values: UpdateSkillFormValues
  ): UpdateSkillPayload | null => {
    const trimmedName = values.skillName.trim();
    if (!values.skillId || !trimmedName) {
      return null;
    }

    let categoryId: string | undefined;
    if (values.categoryId) {
      const parsedCategoryId = parseInt(values.categoryId, 10);
      if (Number.isNaN(parsedCategoryId)) {
        return null;
      }
      categoryId = String(parsedCategoryId);
    }

    return {
      skillId: values.skillId,
      name: trimmedName,
      categoryId,
    };
  };

  const formik = useFormik<UpdateSkillFormValues>({
    initialValues,
    validate,
    onSubmit: async (values, helpers) => {
      const payload = mapValuesToPayload(values);
      if (!payload) {
        return;
      }

      try {
        await updateSkill(payload);
        helpers.resetForm();
        onSuccess();
      } catch (err) {
      }
    },
  });

  const handleSkillSelect = (skillId: string) => {
    formik.setFieldValue('skillId', skillId);
    const skill = allSkillsForSelect.find((s) => s.id === skillId);
    if (skill) {
      formik.setFieldValue('skillName', skill.name);
      const skillData = displayCategories
        .flatMap((cat) => [
          ...cat.skills.map((s) => ({ skill: s, categoryId: cat.id })),
          ...(cat.children?.flatMap((child) =>
            child.skills.map((s) => ({ skill: s, categoryId: child.id }))
          ) || []),
        ])
        .find((item) => item.skill.id === skillId);
      if (skillData) {
        formik.setFieldValue('categoryId', skillData.categoryId);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t("features.skills.updateForm.title")}
      primaryAction={{
        label: t("features.skills.common.confirm"),
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting || !formik.values.skillId,
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
        <div className="space-y-1">
          <label
            htmlFor="skillId"
            className="text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            {t("features.skills.updateForm.labels.selectSkill")}
          </label>
          <select
            id="skillId"
            value={formik.values.skillId}
            onChange={(e) => handleSkillSelect(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="" className="text-black">
              {t("features.skills.updateForm.placeholders.selectSkill")}
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

        <div>
          <Input
            id="skillName"
            label={t("features.skills.updateForm.labels.skillName")}
            placeholder={t("features.skills.updateForm.placeholders.skillName")}
            {...formik.getFieldProps("skillName")}
            required
            disabled={!formik.values.skillId}
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
            {t("features.skills.updateForm.labels.category")}
          </label>
          <select
            id="categoryId"
            {...formik.getFieldProps("categoryId")}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={!formik.values.skillId}
          >
            <option value="" className="text-black">
              {t("features.skills.updateForm.placeholders.category")}
            </option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id} className="text-black">
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

