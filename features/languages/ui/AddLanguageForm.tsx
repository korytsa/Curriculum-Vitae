"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Select } from "@/shared/ui";
import { useCreateLanguage } from "../model/useCreateLanguage";
import { useLanguages } from "../model/useLanguages";
import { useLanguageOptions } from "../model/useLanguagesData";
import { DEFAULT_PROFICIENCY, PROFICIENCY_LEVELS } from "../model/constants";
import type { CreateLanguagePayload } from "../model/useCreateLanguage";
import type { Proficiency } from "@/shared/graphql/generated";

interface AddLanguageFormValues {
  languageName: string;
  proficiency: Proficiency;
}

interface AddLanguageFormProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddLanguageForm({ open, onSuccess, onCancel }: AddLanguageFormProps) {
  const { createLanguage, loading, error } = useCreateLanguage();
  const { languagesData } = useLanguages();
  const { t } = useTranslation();
  const languageOptions = useLanguageOptions(languagesData);

  const initialValues: AddLanguageFormValues = {
    languageName: "",
    proficiency: DEFAULT_PROFICIENCY,
  };

  const validate = (values: AddLanguageFormValues) => {
    const errors: Partial<Record<keyof AddLanguageFormValues, string>> = {};

    if (!values.languageName) {
      errors.languageName = t("features.languages.addForm.errors.languageRequired");
    }

    if (!values.proficiency) {
      errors.proficiency = t("features.languages.addForm.errors.proficiencyRequired");
    }

    return errors;
  };

  const mapValuesToPayload = (values: AddLanguageFormValues): CreateLanguagePayload | null => {
    if (!values.languageName || !values.proficiency) {
      return null;
    }

    return {
      name: values.languageName,
      proficiency: values.proficiency,
    };
  };

  const formik = useFormik<AddLanguageFormValues>({
    initialValues,
    validate,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      const payload = mapValuesToPayload(values);
      if (!payload) {
        return;
      }

      await createLanguage(payload);
      helpers.resetForm();
      onSuccess();
    },
  });

  const proficiencyOptions = PROFICIENCY_LEVELS.map((level) => ({
    value: level,
    label: t(`features.languages.levels.${level}`, level),
  }));

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t("features.languages.addForm.title")}
      primaryAction={{
        label: t("features.languages.common.confirm"),
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting,
      }}
      secondaryAction={{
        label: t("features.languages.common.cancel"),
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
            id="languageName"
            label={t("features.languages.addForm.labels.language")}
            value={formik.values.languageName}
            onChange={(value) => formik.setFieldValue("languageName", value)}
            options={languageOptions}
            align="bottom"
            error={formik.touched.languageName && formik.errors.languageName ? formik.errors.languageName : undefined}
          />
        </div>

        <div>
          <Select
            id="proficiency"
            label={t("features.languages.addForm.labels.proficiency")}
            value={formik.values.proficiency}
            onChange={(value) => formik.setFieldValue("proficiency", value as Proficiency)}
            options={proficiencyOptions}
            align="bottom"
            error={formik.touched.proficiency && formik.errors.proficiency ? formik.errors.proficiency : undefined}
          />
        </div>
      </div>
    </Modal>
  );
}
