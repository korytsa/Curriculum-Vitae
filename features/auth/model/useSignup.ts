"use client";
import { useMutation } from "@apollo/client/react";
import { useRouter, usePathname } from "next/navigation";
import { setAccessToken } from "@/shared/config/apollo";
import { SIGNUP_MUTATION } from "./graphql";

interface SignupVariables {
  auth: {
    email: string;
    password: string;
  };
}

interface SignupResponse {
  signup: {
    access_token: string;
  };
}

export type SignupPayload = {
  email: string;
  password: string;
};

export function useSignup() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [signupMutation, { loading, error }] = useMutation<
    SignupResponse,
    SignupVariables
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
      router.push(`/${locale}/cvs`);
    }
  };

  return {
    signup: handleSignup,
    loading,
    error,
  };
}

