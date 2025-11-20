"use client";

import { RESET_PASSWORD_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";

interface ResetPasswordVariables {
  auth: {
    newPassword: string;
  };
}

interface ResetPasswordResponse {
  resetPassword: null;
}

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export function useResetPassword() {
  const { mutate, loading, error } = useSafeMutation<
    ResetPasswordResponse,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION);

  return {
    resetPassword: ({ token, newPassword }: ResetPasswordPayload) =>
      mutate({
        variables: {
          auth: {
            newPassword,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      }),
    loading,
    error,
  };
}
