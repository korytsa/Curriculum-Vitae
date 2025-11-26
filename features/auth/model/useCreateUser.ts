"use client";
import { useRouter, usePathname } from "next/navigation";
import { CREATE_USER_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";
import type {
  CreateUserMutation,
  CreateUserMutationVariables,
  CreateUserInput,
} from "@/shared/graphql/generated";

export type CreateUserPayload = CreateUserInput;

export function useCreateUser() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const { mutate, loading, error } = useSafeMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_MUTATION, {
    onCompleted: () => {
      router.push(`/${locale}/users`);
    },
  });

  const handleCreateUser = (payload: CreateUserPayload) =>
    mutate({
      variables: {
        user: payload,
      },
    });

  return {
    createUser: handleCreateUser,
    loading,
    error,
  };
}

