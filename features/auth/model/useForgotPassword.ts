"use client";

import { FORGOT_PASSWORD_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";
import type {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
} from "@/shared/graphql/generated";

export type ForgotPasswordPayload =
  ForgotPasswordMutationVariables["auth"];

export function useForgotPassword() {
  const { mutate, loading, error } = useSafeMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
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
