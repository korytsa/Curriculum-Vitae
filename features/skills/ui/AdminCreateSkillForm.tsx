"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Select, Input } from "@/shared/ui";
import { useAdminCreateSkill } from "../model/useAdminCreateSkill";
import { useAdminSkills } from "../model/useAdminSkills";
import type { AdminCreateSkillPayload } from "../model/useAdminCreateSkill";
import type { SkillCategory } from "@/shared/graphql/generated";

interface AdminCreateSkillFormValues {
  name: string;
  typeId: string;
  categoryId: string;
}

interface AdminCreateSkillFormProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminCreateSkillForm({ open, onSuccess, onCancel }: AdminCreateSkillFormProps) {
  const { createSkill, loading, error } = useAdminCreateSkill();
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

  const initialValues: AdminCreateSkillFormValues = {
    name: "",
    typeId: "",
    categoryId: "",
  };

  const validate = (values: AdminCreateSkillFormValues) => {
    const errors: Partial<Record<keyof AdminCreateSkillFormValues, string>> = {};

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

  const formik = useFormik<AdminCreateSkillFormValues>({
    initialValues,
    validate,
    onSubmit: async (values, helpers) => {
      const payload: AdminCreateSkillPayload = {
        name: values.name.trim(),
        categoryId: values.categoryId || undefined,
      };

      await createSkill(payload);
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
      title={t("admin.skills.form.createTitle")}
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
