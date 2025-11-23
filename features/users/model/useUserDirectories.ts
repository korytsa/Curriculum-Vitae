import { useQuery } from "@apollo/client/react";
import { USER_DIRECTORIES_QUERY } from "./graphql";
import type { Department, Position } from "@/shared/graphql/generated";

type DirectoriesQueryResponse = {
  departments: Array<Pick<Department, "id" | "name">>;
  positions: Array<Pick<Position, "id" | "name">>;
};

export function useUserDirectories() {
  const { data, loading, error } = useQuery<DirectoriesQueryResponse>(
    USER_DIRECTORIES_QUERY,
    {
      fetchPolicy: "cache-first",
    }
  );

  return {
    departments: data?.departments ?? [],
    positions: data?.positions ?? [],
    loading,
    error,
  };
}
