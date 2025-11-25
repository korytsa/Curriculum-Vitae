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

export function useDeleteUser() {
  const { mutate, loading, error } = useSafeMutation<
    DeleteUserMutation,
    MutationDeleteUserArgs
  >(DELETE_USER_MUTATION);

  const deleteUser = (userId: string) =>
    mutate({
      variables: { userId },
    });

  return {
    deleteUser,
    loading,
    error,
  };
}
