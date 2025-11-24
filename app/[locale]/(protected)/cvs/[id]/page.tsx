"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Button, Input, FormStatus } from "@/shared/ui";
import { useCv, useUpdateCv } from "@/features/cvs";
import { Loader } from "@/shared/ui";

type CvDetailsPageProps = {
  params: { locale: string; id: string };
};

export default function CvDetailsPage({ params }: CvDetailsPageProps) {
  const { t } = useTranslation();
  const { cv, loading: cvLoading } = useCv(params.id);
  const { updateCv, loading: updateLoading, error } = useUpdateCv(params.id);

  const formik = useFormik({
    initialValues: {
      name: cv?.name || "",
      education: cv?.education || "",
      description: cv?.description || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.name.trim()) {
        errors.name = t("cvs.createModal.errors.nameRequired", {
          defaultValue: "Name is required",
        });
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await updateCv({
          name: values.name.trim(),
          education: values.education?.trim() || undefined,
          description: values.description?.trim() || "",
        });
        toast.success(
          t("cvs.details.notifications.success", {
            defaultValue: "CV updated successfully",
          })
        );
      } catch (err) {
        console.error("Error updating CV:", err);
        toast.error(
          t("cvs.details.notifications.error", {
            defaultValue: "Failed to update CV",
          })
        );
      }
    },
  });

  if (cvLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="max-w-[900px] mx-auto space-y-6">
        <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <Input
              id="name"
              label={t("cvs.createModal.labels.name", { defaultValue: "Name" })}
              {...formik.getFieldProps("name")}
              required
              error={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : undefined
              }
            />
          </div>

          <div>
            <Input
              id="education"
              label={t("cvs.createModal.labels.education", {
                defaultValue: "Education",
              })}
              {...formik.getFieldProps("education")}
              error={
                formik.touched.education && formik.errors.education
                  ? formik.errors.education
                  : undefined
              }
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              {t("cvs.createModal.labels.description", {
                defaultValue: "Description",
              })}
            </label>
            <textarea
              id="description"
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-white/40 focus:border-white focus:outline-none min-h-[140px] resize-none"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={updateLoading || !formik.isValid || formik.isSubmitting}
            >
              {t("cvs.details.actions.update", { defaultValue: "UPDATE" })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
