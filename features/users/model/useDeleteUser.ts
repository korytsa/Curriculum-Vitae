"use client";

import { useSafeMutation } from "@/shared/lib";
import { DELETE_USER_MUTATION } from "./graphql";
import type {
  DeleteResult,
  MutationDeleteUserArgs,
} from "@/shared/graphql/generated";

type DeleteUserMutation = {
  deleteUser: DeleteResult;
};

type ErrorHandler = (message: string, error: unknown) => void;

export function useDeleteUser() {
  const { mutate, loading, error } = useSafeMutation<
    DeleteUserMutation,
    MutationDeleteUserArgs
  >(DELETE_USER_MUTATION);

  const deleteUser = (
    userId: string,
    options?: { errorHandler?: ErrorHandler; skipErrorToast?: boolean }
  ) =>
    mutate({
      variables: { userId },
      context: {
        errorHandler: options?.errorHandler,
        skipErrorToast: options?.skipErrorToast,
      },
    });

  return {
    deleteUser,
    loading,
    error,
  };
}
