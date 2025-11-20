"use client";

import { FORGOT_PASSWORD_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";

interface ForgotPasswordVariables {
  auth: {
    email: string;
  };
}

interface ForgotPasswordResponse {
  forgotPassword: null;
}

export type ForgotPasswordPayload = {
  email: string;
};

export function useForgotPassword() {
  const { mutate, loading, error } = useSafeMutation<
    ForgotPasswordResponse,
    ForgotPasswordVariables
  >(FORGOT_PASSWORD_MUTATION);

  return {
    forgotPassword: ({ email }: ForgotPasswordPayload) =>
      mutate({
        variables: { auth: { email } },
      }),
    loading,
    error,
  };
}
