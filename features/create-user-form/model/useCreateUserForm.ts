"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik, type FormikProps } from "formik";
import { useCreateUser, type CreateUserPayload } from "@/features/auth";

export type CreateUserFormRole = "Admin" | "Employee";

export interface CreateUserFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: CreateUserFormRole;
}

export interface CreateUserFormHook {
  formik: FormikProps<CreateUserFormValues>;
  successMessage: string | null;
  loading: boolean;
  errorMessage: string | null;
}

export function useCreateUserForm(): CreateUserFormHook {
  const { createUser, loading, error } = useCreateUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { t } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const initialValues: CreateUserFormValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    positionId: "",
    role: "Employee",
  };

  const validate = (values: CreateUserFormValues) => {
    const errors: Partial<Record<keyof CreateUserFormValues, string>> = {};

    if (!values.email.trim()) {
      errors.email = t("features.createUserForm.errors.emailRequired");
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = t("features.createUserForm.errors.emailInvalid");
    }

    if (!values.password.trim()) {
      errors.password = t("features.createUserForm.errors.passwordRequired");
    }

    return errors;
  };

  const mapValuesToCreatePayload = (
    values: CreateUserFormValues
  ): CreateUserPayload => ({
    auth: {
      email: values.email.trim(),
      password: values.password,
    },
    profile: {
      first_name: values.firstName,
      last_name: values.lastName,
    },
    role: values.role,
    departmentId: values.departmentId.trim() || undefined,
    positionId: values.positionId.trim() || undefined,
    cvsIds: [],
  });

  const formik = useFormik<CreateUserFormValues>({
    initialValues,
    validateOnMount: true,
    validate,
    onSubmit: async (values, helpers) => {
      setSuccessMessage(null);
      setFormError(null);

      try {
        const payload = mapValuesToCreatePayload(values);
        await createUser(payload);

        setSuccessMessage(
          t("features.createUserForm.notifications.success", {
            email: payload.auth.email,
            role: payload.role,
          })
        );
        helpers.resetForm();
      } catch (submitError) {
        const fallbackMessage =
          submitError instanceof Error
            ? submitError.message
            : t("features.createUserForm.errors.submitFailed");
        setFormError(fallbackMessage);
      }
    },
  });

  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  return {
    formik,
    successMessage,
    loading,
    errorMessage: formError ?? error?.message ?? null,
  };
}
