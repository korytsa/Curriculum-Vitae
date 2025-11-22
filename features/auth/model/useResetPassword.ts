"use client";

import { RESET_PASSWORD_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";
import type {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from "@/shared/graphql/generated";

export type ResetPasswordPayload = ResetPasswordMutationVariables["auth"] & {
  token: string;
};

export function useResetPassword() {
  const { mutate, loading, error } = useSafeMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
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
