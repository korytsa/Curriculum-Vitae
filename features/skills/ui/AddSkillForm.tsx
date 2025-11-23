"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Select } from "@/shared/ui";
import { useCreateSkill } from "../model/useCreateSkill";
import { useSkills } from "../model/useSkills";
import { useSkillSelectOptions } from "../model/useSkillSelectOptions";
import { MASTERY_OPTIONS } from "../model/constants";
import type { CreateSkillPayload } from "../model/useCreateSkill";
import type { Mastery } from "@/shared/graphql/generated";

interface AddSkillFormValues {
  skillId: string;
  mastery: Mastery;
}

interface AddSkillFormProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddSkillForm({ open, onSuccess, onCancel }: AddSkillFormProps) {
  const { createSkill, loading, error } = useCreateSkill();
  const { skillsData } = useSkills();
  const { t } = useTranslation();
  const { skillOptions, selectOptions } = useSkillSelectOptions(skillsData);

  const initialValues: AddSkillFormValues = {
    skillId: "",
    mastery: "Novice",
  };

  const validate = (values: AddSkillFormValues) => {
    const errors: Partial<Record<keyof AddSkillFormValues, string>> = {};

    if (!values.skillId) {
      errors.skillId = t("features.skills.addForm.errors.skillRequired");
    }

    if (!values.mastery) {
      errors.mastery = t("features.skills.addForm.errors.masteryRequired");
    }

    return errors;
  };

  const mapValuesToPayload = (
    values: AddSkillFormValues
  ): CreateSkillPayload | null => {
    if (!values.skillId) {
      return null;
    }

    if (!values.mastery) {
      return null;
    }

    const [skillId, categoryId] = values.skillId.split("|");
    const selectedSkill = skillOptions.find(
      (opt) => opt.value === values.skillId
    );

    if (!selectedSkill) {
      return null;
    }

    const skill = skillsData?.skills.find((s) => s.id === skillId);
    if (!skill) {
      return null;
    }

    return {
      name: skill.name,
      categoryId: categoryId || undefined,
      mastery: values.mastery,
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
        console.error("Error creating skill:", err);
      }
    },
  });

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
          <Select
            id="skillId"
            label={t("features.skills.addForm.labels.skill")}
            value={formik.values.skillId}
            onChange={(value) => formik.setFieldValue("skillId", value)}
            options={selectOptions}
            placeholder={t("features.skills.addForm.placeholders.selectSkill")}
            error={
              formik.touched.skillId && formik.errors.skillId
                ? formik.errors.skillId
                : undefined
            }
          />
        </div>

        <div>
          <Select
            id="mastery"
            label={t("features.skills.addForm.labels.mastery")}
            value={formik.values.mastery}
            onChange={(value) =>
              formik.setFieldValue("mastery", value as Mastery)
            }
            options={MASTERY_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            error={
              formik.touched.mastery && formik.errors.mastery
                ? formik.errors.mastery
                : undefined
            }
          />
        </div>
      </div>
    </Modal>
  );
}
