"use client";
import { useRouter, usePathname } from "next/navigation";
import { CREATE_USER_MUTATION } from "./graphql";
import { useSafeMutation } from "@/shared/lib";

interface CreateUserVariables {
  user: {
    auth: {
      email: string;
      password: string;
    };
    profile: {
      first_name: string;
      last_name: string;
    };
    departmentId?: string;
    positionId?: string;
    cvsIds: string[];
    role: "Admin" | "Employee";
  };
}

interface CreateUserResponse {
  createUser: {
    id: string;
    email: string;
    role: "Admin" | "Employee";
  };
}

export type CreateUserPayload = {
  email: string;
  password: string;
  profile?: { first_name?: string; last_name?: string };
  role?: "Admin" | "Employee";
  departmentId?: string;
  positionId?: string;
};

export function useCreateUser() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const { mutate, loading, error } = useSafeMutation<
    CreateUserResponse,
    CreateUserVariables
  >(CREATE_USER_MUTATION, {
    onCompleted: () => {
      router.push(`/${locale}/users`);
    },
  });

  const handleCreateUser = ({
    email,
    password,
    profile = {},
    role = "Employee",
    departmentId,
    positionId,
  }: CreateUserPayload) => {
    const profilePayload = {
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
    };

    return mutate({
      variables: {
        user: {
          auth: {
            email,
            password,
          },
          profile: profilePayload,
          cvsIds: [],
          departmentId,
          positionId,
          role,
        },
      },
    });
  };

  return {
    createUser: handleCreateUser,
    loading,
    error,
  };
}

