"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/shared/ui";
import { useResetPassword } from "@/features/auth";

type ResetPasswordFormProps = {
  token: string | null;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { resetPassword, loading, error } = useResetPassword();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};

      if (!values.password.trim()) {
        errors.password = t("features.resetPassword.errors.passwordRequired");
      } else if (values.password.trim().length < 5) {
        errors.password = t("features.resetPassword.errors.passwordLength");
      }

      if (!values.confirmPassword.trim()) {
        errors.confirmPassword = t("features.resetPassword.errors.confirmRequired");
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = t("features.resetPassword.errors.passwordMismatch");
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      if (!token) {
        setFeedback({
          type: "error",
          message: t("features.resetPassword.feedback.missingToken"),
        });
        return;
      }

      try {
        await resetPassword(token, values.password);
        setFeedback({
          type: "success",
          message: t("features.resetPassword.feedback.success"),
        });
        helpers.resetForm();
      } catch (mutationError) {
        const fallbackMessage =
          mutationError instanceof Error
            ? mutationError.message
            : t("features.resetPassword.feedback.genericError");
        setFeedback({ type: "error", message: fallbackMessage });
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            {t("features.resetPassword.headings.title")}
          </h1>
          <p className="text-lg text-white/80">
            {t("features.resetPassword.headings.subtitle")}
          </p>
        </div>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {feedback && (
            <div
              className={`p-3 rounded-lg text-sm ${
                feedback.type === "success"
                  ? "bg-green-500/20 border border-green-500 text-green-300"
                  : "bg-red-500/20 border border-red-500 text-red-400"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error.message}
            </div>
          )}

          <div>
            <Input
              id="password"
              type="password"
              label={t("features.resetPassword.labels.password")}
              placeholder={t("features.resetPassword.placeholders.password")}
              {...formik.getFieldProps("password")}
              required
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-sm text-red-400">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          <div>
            <Input
              id="confirmPassword"
              type="password"
              label={t("features.resetPassword.labels.confirmPassword")}
              placeholder={t("features.resetPassword.placeholders.confirmPassword")}
              {...formik.getFieldProps("confirmPassword")}
              required
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="mt-1 text-sm text-red-400">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={
              loading || !formik.isValid || formik.isSubmitting || !token
            }
          >
            {loading || formik.isSubmitting
              ? t("features.resetPassword.buttons.updating")
              : t("features.resetPassword.buttons.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
