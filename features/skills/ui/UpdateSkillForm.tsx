'use client';

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useUpdateSkill } from "../model/useUpdateSkill";
import { UpdateSkillFormView } from "./UpdateSkillFormView";
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
  const { t } = useTranslation();

  const formik = useFormik<UpdateSkillFormValues>({
    initialValues: {
      skillId: '',
      skillName: '',
      categoryId: '',
    },
    validate: (values) => {
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
    },
    onSubmit: async (values, helpers) => {
      const categoryIdNum = values.categoryId ? parseInt(values.categoryId, 10) : undefined;
      if (values.categoryId && isNaN(categoryIdNum!)) {
        return;
      }

      try {
        await updateSkill(values.skillId, values.skillName.trim(), categoryIdNum);
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
    <UpdateSkillFormView
      formik={formik}
      categoryOptions={categoryOptions}
      allSkillsForSelect={allSkillsForSelect}
      error={error}
      loading={loading}
      open={open}
      onCancel={onCancel}
      onSkillSelect={handleSkillSelect}
    />
  );
}

