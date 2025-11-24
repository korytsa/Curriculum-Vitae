import { useQuery } from "@apollo/client/react";
import { USER_QUERY } from "./graphql";
import type { User } from "@/app/[locale]/(protected)/users/types";

type UserQueryResponse = {
  user: User;
};

type UseUserOptions = {
  skip?: boolean;
};

export function useUser(userId?: string, options?: UseUserOptions) {
  const shouldSkip = options?.skip || !userId;

  const { data, loading, error, refetch } = useQuery<UserQueryResponse>(
    USER_QUERY,
    {
      variables: { userId: userId ?? "" },
      skip: shouldSkip,
      fetchPolicy: "cache-first",
    }
  );

  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
}

