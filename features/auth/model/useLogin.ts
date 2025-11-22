"use client";

import { useLazyQuery } from "@apollo/client/react";
import { usePathname, useRouter } from "next/navigation";
import { setAccessToken } from "@/shared/config/apollo";
import { LOGIN_QUERY } from "./graphql";
import type {
  LoginQuery,
  LoginQueryVariables,
} from "@/shared/graphql/generated";

export type LoginPayload = {
  email: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loginQuery, { loading, error }] = useLazyQuery<
    LoginQuery,
    LoginQueryVariables
  >(LOGIN_QUERY, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  const handleLogin = async ({ email, password }: LoginPayload) => {
    try {
      const result = await loginQuery({
        variables: {
          auth: {
            email,
            password,
          },
        },
      });

      if (result.error) {
        console.error("[Login error]", result.error);
        throw result.error;
      }

      if (!result.data?.login) {
        console.error("[Login error] No login data received");
        throw new Error("Invalid response from server");
      }

      const token = result.data.login.access_token;
      if (token) {
        setAccessToken(token);
        router.push(`/${locale}/users`);
      } else {
        console.error("[Login error] No token received");
        throw new Error("No access token received");
      }
    } catch (err) {
      console.error("[Login error]", err);
      throw err;
    }
  };

  return {
    login: handleLogin,
    loading,
    error,
  };
}
