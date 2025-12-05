"use client";

import { useLazyQuery } from "@apollo/client/react";
import { usePathname, useRouter } from "next/navigation";
import { setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { LOGIN_QUERY } from "./graphql";
import type { LoginQuery, LoginQueryVariables } from "@/shared/graphql/generated";

export type LoginPayload = {
  email: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loginQuery, { loading, error }] = useLazyQuery<LoginQuery, LoginQueryVariables>(LOGIN_QUERY, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  const handleLogin = async ({ email, password }: LoginPayload) => {
    const result = await loginQuery({
      variables: {
        auth: {
          email,
          password,
        },
      },
    });

    if (result.error) {
      throw result.error;
    }

    const token = result.data?.login?.access_token;
    if (!token) {
      throw new Error("No access token received");
    }

    setAccessToken(token);
    const decodedToken = decodeToken(token);
    const userId = decodedToken?.sub?.toString();
    if (userId) {
      router.push(`/${locale}/users/${userId}`);
    } else {
      router.push(`/${locale}/users/`);
    }
  };

  return {
    login: handleLogin,
    loading,
    error,
  };
}
