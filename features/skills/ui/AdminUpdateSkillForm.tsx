"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Select, Input } from "@/shared/ui";
import { useAdminUpdateSkill } from "../model/useAdminUpdateSkill";
import { useAdminSkills } from "../model/useAdminSkills";
import type { AdminUpdateSkillPayload } from "../model/useAdminUpdateSkill";
import type { AdminSkill } from "../model/adminTypes";
import type { SkillCategory } from "@/shared/graphql/generated";

interface AdminUpdateSkillFormValues {
  name: string;
  typeId: string;
  categoryId: string;
}

interface AdminUpdateSkillFormProps {
  open: boolean;
  skill: AdminSkill | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminUpdateSkillForm({ open, skill, onSuccess, onCancel }: AdminUpdateSkillFormProps) {
  const { updateSkill, loading, error } = useAdminUpdateSkill();
  const { adminSkillsData } = useAdminSkills();
  const { t } = useTranslation();

  const typeOptions = (() => {
    if (!adminSkillsData?.skillCategories) return [];

    const parentCategories = adminSkillsData.skillCategories.filter((cat: SkillCategory) => !cat.parent);

    if (parentCategories.length > 0) {
      return parentCategories.map((cat: SkillCategory) => ({
        value: cat.id,
        label: cat.name,
      }));
    }

    const uniqueParents = new Map<string, { id: string; name: string }>();
    adminSkillsData.skillCategories.forEach((cat: SkillCategory) => {
      if (cat.parent) {
        const parentId = cat.parent.id;
        if (!uniqueParents.has(parentId)) {
          uniqueParents.set(parentId, { id: parentId, name: cat.parent.name });
        }
      }
    });

    return Array.from(uniqueParents.values()).map((parent) => ({
      value: parent.id,
      label: parent.name,
    }));
  })();

  const getTypeIdFromSkill = (skill: AdminSkill | null): string => {
    if (!skill || !adminSkillsData?.skillCategories) return "";
    const category = adminSkillsData.skillCategories.find((cat: SkillCategory) => cat.id === skill.category?.id);
    return category?.parent?.id || "";
  };

  const initialValues: AdminUpdateSkillFormValues = {
    name: skill?.name || "",
    typeId: getTypeIdFromSkill(skill),
    categoryId: skill?.category?.id || "",
  };

  const validate = (values: AdminUpdateSkillFormValues) => {
    const errors: Partial<Record<keyof AdminUpdateSkillFormValues, string>> = {};

    if (!values.name.trim()) {
      errors.name = t("admin.skills.form.errors.nameRequired");
    }

    if (!values.typeId) {
      errors.typeId = t("admin.skills.form.errors.typeRequired");
    }

    if (!values.categoryId) {
      errors.categoryId = t("admin.skills.form.errors.categoryRequired");
    }

    return errors;
  };

  const formik = useFormik<AdminUpdateSkillFormValues>({
    initialValues,
    validate,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      if (!skill) return;

      const payload: AdminUpdateSkillPayload = {
        skillId: skill.id,
        name: values.name.trim(),
        categoryId: values.categoryId || undefined,
      };

      await updateSkill(payload);
      helpers.resetForm();
      onSuccess();
    },
  });

  const categoryOptions = (() => {
    if (!formik.values.typeId) {
      return (
        adminSkillsData?.skillCategories.map((cat: SkillCategory) => ({
          value: cat.id,
          label: cat.name,
        })) || []
      );
    }

    return (
      adminSkillsData?.skillCategories
        .filter((cat: SkillCategory) => cat.parent?.id === formik.values.typeId)
        .map((cat: SkillCategory) => ({
          value: cat.id,
          label: cat.name,
        })) || []
    );
  })();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t("admin.skills.form.updateTitle")}
      primaryAction={{
        label: t("admin.skills.form.confirm"),
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting,
        variant: "danger",
      }}
      secondaryAction={{
        label: t("admin.skills.form.cancel"),
        onClick: () => {
          formik.resetForm();
          onCancel();
        },
      }}
    >
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

      <div className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label={t("admin.skills.form.labels.name")}
          placeholder={t("admin.skills.form.labels.name")}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
        />

        <Select
          id="typeId"
          label={t("admin.skills.form.labels.type")}
          value={formik.values.typeId}
          onChange={(value) => {
            formik.setFieldValue("typeId", value);
            formik.setFieldValue("categoryId", "");
          }}
          options={typeOptions}
          align="bottom"
          error={formik.touched.typeId && formik.errors.typeId ? formik.errors.typeId : undefined}
        />

        <Select
          id="categoryId"
          label={t("admin.skills.form.labels.category")}
          value={formik.values.categoryId}
          onChange={(value) => formik.setFieldValue("categoryId", value)}
          options={categoryOptions}
          align="bottom"
          error={formik.touched.categoryId && formik.errors.categoryId ? formik.errors.categoryId : undefined}
        />
      </div>
    </Modal>
  );
}
