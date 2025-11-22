"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, Input, FormStatus } from "@/shared/ui";
import { useLogin, useForgotPassword } from "@/features/auth";
import type { LoginPayload } from "@/features/auth";

export function LoginForm() {
  const { login, loading, error } = useLogin();
  const { forgotPassword, loading: forgotLoading } = useForgotPassword();
  const [forgotFeedback, setForgotFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { t } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const initialValues = {
    email: "",
    password: "",
  };

  const validate = (values: typeof initialValues) => {
    const errors: Partial<typeof values> = {};

    if (!values.email.trim()) {
      errors.email = t("features.loginForm.errors.emailRequired");
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = t("features.loginForm.errors.emailInvalid");
    }

    if (!values.password.trim()) {
      errors.password = t("features.loginForm.errors.passwordRequired");
    }

    return errors;
  };

  const mapValuesToLoginPayload = (
    values: typeof initialValues
  ): LoginPayload => ({
    email: values.email.trim(),
    password: values.password,
  });

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await login(mapValuesToLoginPayload(values));
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <FormStatus
        errorMessage={error?.message ?? null}
        successMessage={forgotFeedback?.type === "success" ? forgotFeedback.message : null}
        noticeMessage={forgotFeedback?.type === "error" ? forgotFeedback.message : null}
      />
      <div>
        <Input
          id="email"
          type="email"
          label={t("features.loginForm.labels.email")}
          placeholder={t("features.loginForm.placeholders.email")}
          {...formik.getFieldProps("email")}
          required
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
        ) : null}
      </div>

      <div>
        <Input
          id="password"
          type="password"
          label={t("features.loginForm.labels.password")}
          placeholder={t("features.loginForm.placeholders.password")}
          {...formik.getFieldProps("password")}
          required
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
        ) : null}
      </div>

      <Button
        variant="primary"
        className="w-full"
        type="submit"
        disabled={loading || !formik.isValid || formik.isSubmitting}
      >
        {loading || formik.isSubmitting
          ? t("features.loginForm.buttons.loggingIn")
          : t("features.loginForm.buttons.login")}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-white/60 hover:text-white transition-colors disabled:opacity-60"
          onClick={async () => {
            const trimmedEmail = formik.values.email.trim();
            if (!trimmedEmail) {
              setForgotFeedback({
                type: "error",
                message: t("features.loginForm.forgotPassword.emailMissing"),
              });
              return;
            }

            if (!emailRegex.test(trimmedEmail)) {
              setForgotFeedback({
                type: "error",
                message: t("features.loginForm.forgotPassword.emailInvalid"),
              });
              return;
            }

            setForgotFeedback(null);

            try {
              await forgotPassword({ email: trimmedEmail });
              setForgotFeedback({
                type: "success",
                message: t("features.loginForm.forgotPassword.success"),
              });
            } catch (forgotError) {
              const fallbackMessage =
                forgotError instanceof Error
                  ? forgotError.message
                  : t("features.loginForm.forgotPassword.genericError");
              setForgotFeedback({ type: "error", message: fallbackMessage });
            }
          }}
          disabled={forgotLoading}
        >
          {forgotLoading
            ? t("features.loginForm.forgotPassword.sending")
            : t("features.loginForm.forgotPassword.cta")}
        </Button>
      </div>
    </form>
  );
}
