"use client";
import { useMutation } from "@apollo/client/react";
import { useRouter, usePathname } from "next/navigation";
import { setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { SIGNUP_MUTATION } from "./graphql";
import type {
  SignupMutation,
  SignupMutationVariables,
} from "@/shared/graphql/generated";

export type SignupPayload = {
  email: string;
  password: string;
};

export function useSignup() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [signupMutation, { loading, error }] = useMutation<
    SignupMutation,
    SignupMutationVariables
  >(SIGNUP_MUTATION);

  const handleSignup = async ({ email, password }: SignupPayload) => {
    const result = await signupMutation({
      variables: {
        auth: {
          email,
          password,
        },
      },
    });

    const token = result.data?.signup.access_token;
    if (token) {
      setAccessToken(token);
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.sub?.toString();
      if (userId) {
        router.push(`/${locale}/users/${userId}`);
      } else {
        router.push(`/${locale}/users`);
      }
    }
  };

  return {
    signup: handleSignup,
    loading,
    error,
  };
}
