import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik, type FormikProps } from "formik";
import { useCreateUser } from "@/features/auth";

export type CreateUserFormRole = 'Admin' | 'Employee'

export interface CreateUserFormValues {
  email: string
  password: string
  firstName: string
  lastName: string
  departmentId: string
  positionId: string
  role: CreateUserFormRole
}

export interface CreateUserFormHook {
  formik: FormikProps<CreateUserFormValues>
  successMessage: string | null
  loading: boolean
  errorMessage: string | null
}

export function useCreateUserForm(): CreateUserFormHook {
  const { createUser, loading, error } = useCreateUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const formik = useFormik<CreateUserFormValues>({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      departmentId: "",
      positionId: "",
      role: "Employee",
    },
    validateOnMount: true,
    validate: (values) => {
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
    },
    onSubmit: async (values, helpers) => {
      setSuccessMessage(null);

      await createUser({
        email: values.email.trim(),
        password: values.password,
        profile: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
        role: values.role,
        departmentId: values.departmentId.trim() || undefined,
        positionId: values.positionId.trim() || undefined,
      });

      setSuccessMessage(
        t("features.createUserForm.notifications.success", {
          email: values.email,
          role: values.role,
        })
      );
      helpers.resetForm();
    },
  });

  return {
    formik,
    successMessage,
    loading,
    errorMessage: error?.message ?? null,
  };
}

