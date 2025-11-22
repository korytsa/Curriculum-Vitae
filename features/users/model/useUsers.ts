import { useQuery } from "@apollo/client/react";
import { USERS_QUERY } from "./graphql";
import type { UsersQuery } from "@/shared/graphql/generated";
export function useUsers() {
  const { data, loading, error, refetch } = useQuery<UsersQuery>(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  return { users: data?.users ?? [], loading, error, refetch };
}
