import { useQuery } from "@apollo/client/react";
import { USERS_QUERY } from "./graphql";
import type { UsersQuery } from "@/shared/graphql/generated";

const EMPTY_USERS: UsersQuery["users"] = [];

export function useUsers() {
  const { data, loading, error, refetch } = useQuery<UsersQuery>(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return { users: data?.users ?? EMPTY_USERS, loading, error, refetch };
}
