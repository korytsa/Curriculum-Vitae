"use client";

import { useFormik } from "formik";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input, FormStatus } from "@/shared/ui";
import { useSignup } from "@/features/auth";
import type { SignupPayload } from "@/features/auth";

export function SignupForm() {
  const { signup, loading, error } = useSignup();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const { t } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const initialValues = {
    email: "",
    password: "",
  };

  const validate = (values: typeof initialValues) => {
    const errors: Partial<typeof values> = {};

    if (!values.email.trim()) {
      errors.email = t("features.signupForm.errors.emailRequired");
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = t("features.signupForm.errors.emailInvalid");
    }

    if (!values.password.trim()) {
      errors.password = t("features.signupForm.errors.passwordRequired");
    }

    return errors;
  };

  const mapValuesToSignupPayload = (values: typeof initialValues): SignupPayload => ({
    email: values.email.trim(),
    password: values.password,
  });

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await signup(mapValuesToSignupPayload(values));
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <FormStatus errorMessage={error?.message ?? null} />
      <div>
        <Input
          id="email"
          type="email"
          label={t("features.signupForm.labels.email")}
          placeholder={t("features.signupForm.placeholders.email")}
          {...formik.getFieldProps('email')}
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
          label={t("features.signupForm.labels.password")}
          placeholder={t("features.signupForm.placeholders.password")}
          {...formik.getFieldProps('password')}
          required
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
        ) : null}
      </div>

      <Button variant="primary" className="w-full" type="submit" disabled={loading || !formik.isValid || formik.isSubmitting}>
        {loading || formik.isSubmitting
          ? t("features.signupForm.buttons.creating")
          : t("features.signupForm.buttons.create")}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-white/60 hover:text-white transition-colors"
          onClick={() => router.push(`/${locale}/login`)}
        >
          {t("features.signupForm.links.haveAccount")}
        </Button>
      </div>
    </form>
  )
}

