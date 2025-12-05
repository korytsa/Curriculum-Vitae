"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Input, Modal, FormStatus, Select } from "@/shared/ui";
import { useUpdateSkill } from "../../model/useSkillMutations";
import type { UpdateSkillPayload, CategoryOption, SkillCategory } from "../../types";

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

export function UpdateSkillForm({ open, categoryOptions, displayCategories, allSkillsForSelect, onSuccess, onCancel }: UpdateSkillFormProps) {
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

  const mapValuesToPayload = (values: UpdateSkillFormValues): UpdateSkillPayload | null => {
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

      await updateSkill(payload);
      helpers.resetForm();
      onSuccess();
    },
  });

  const handleSkillSelect = (skillId: string) => {
    formik.setFieldValue("skillId", skillId);
    const skill = allSkillsForSelect.find((s) => s.id === skillId);
    if (skill) {
      formik.setFieldValue("skillName", skill.name);
      const skillData = displayCategories
        .flatMap((cat) => [
          ...cat.skills.map((s) => ({ skill: s, categoryId: cat.id })),
          ...(cat.children?.flatMap((child) => child.skills.map((s) => ({ skill: s, categoryId: child.id }))) || []),
        ])
        .find((item) => item.skill.id === skillId);
      if (skillData) {
        formik.setFieldValue("categoryId", skillData.categoryId);
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
        <Select
          id="skillId"
          label={t("features.skills.updateForm.labels.selectSkill")}
          value={formik.values.skillId}
          onChange={(value) => handleSkillSelect(value)}
          options={allSkillsForSelect.map((skill) => ({
            value: skill.id,
            label: skill.name,
          }))}
          error={formik.touched.skillId && formik.errors.skillId ? formik.errors.skillId : undefined}
        />

        <Input
          id="skillName"
          label={t("features.skills.updateForm.labels.skillName")}
          placeholder={t("features.skills.updateForm.placeholders.skillName")}
          {...formik.getFieldProps("skillName")}
          required
          disabled={!formik.values.skillId}
        />
        {formik.touched.skillName && formik.errors.skillName ? <p className="mt-1 text-sm text-red-400">{formik.errors.skillName}</p> : null}

        <Select
          id="categoryId"
          label={t("features.skills.updateForm.labels.category")}
          value={formik.values.categoryId}
          onChange={(value) => formik.setFieldValue("categoryId", value)}
          options={categoryOptions.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          disabled={!formik.values.skillId}
          error={formik.touched.categoryId && formik.errors.categoryId ? formik.errors.categoryId : undefined}
        />
      </div>
    </Modal>
  );
}
