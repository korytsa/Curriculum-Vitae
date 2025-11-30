"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Button, Input, FormStatus, TextArea } from "@/shared/ui";
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
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
            />
          </div>

          <div>
            <Input
              id="education"
              label={t("cvs.createModal.labels.education", {
                defaultValue: "Education",
              })}
              {...formik.getFieldProps("education")}
              error={formik.touched.education && formik.errors.education ? formik.errors.education : undefined}
            />
          </div>

          <TextArea
            id="description"
            label={t("cvs.createModal.labels.description", {
              defaultValue: "Description",
            })}
            rows={5}
            {...formik.getFieldProps("description")}
            error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="outline" disabled={updateLoading || !formik.isValid || formik.isSubmitting}>
              {t("cvs.details.actions.update", { defaultValue: "UPDATE" })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
