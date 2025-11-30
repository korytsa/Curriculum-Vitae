"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Input } from "@/shared/ui";
import { useCreateCv } from "../model/useCreateCv";
import type { CreateCvPayload } from "../model/useCreateCv";

interface CreateCvModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCvModal({ open, onClose, onSuccess }: CreateCvModalProps) {
  const { t } = useTranslation();
  const { createCv, loading, error } = useCreateCv();

  const formik = useFormik<CreateCvPayload>({
    initialValues: {
      name: "",
      education: "",
      description: "",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof CreateCvPayload, string>> = {};
      if (!values.name.trim()) {
        errors.name = t("cvs.createModal.errors.nameRequired");
      }
      return errors;
    },
    onSubmit: async (values, helpers) => {
      await createCv({
        name: values.name.trim(),
        education: values.education?.trim() || undefined,
        description: values.description?.trim() || "",
      });
      helpers.resetForm();
      onSuccess?.();
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      title={t("cvs.createModal.title")}
      primaryAction={{
        label: t("cvs.createModal.actions.create"),
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting,
      }}
      secondaryAction={{
        label: t("cvs.createModal.actions.cancel"),
        onClick: () => {
          formik.resetForm();
          onClose();
        },
      }}
    >
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

      <div className="space-y-4">
        <Input id="name" label={t("cvs.createModal.labels.name")} {...formik.getFieldProps("name")} error={formik.touched.name ? formik.errors.name : undefined} required />

        <Input id="education" label={t("cvs.createModal.labels.education")} {...formik.getFieldProps("education")} />

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-white/80">
            {t("cvs.createModal.labels.description")}
          </label>
          <textarea
            id="description"
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-white/40 focus:border-white focus:outline-none min-h-[140px] resize-none"
            {...formik.getFieldProps("description")}
          />
        </div>
      </div>
    </Modal>
  );
}
