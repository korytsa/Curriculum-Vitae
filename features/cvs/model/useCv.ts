import { useQuery } from "@apollo/client/react";
import { CV_QUERY } from "./graphql";
import type { CvQuery, CvQueryVariables } from "@/shared/graphql/generated";

export function useCv(cvId: string) {
  const { data, loading, error, refetch } = useQuery<CvQuery, CvQueryVariables>(
    CV_QUERY,
    {
      variables: { cvId },
      skip: !cvId,
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    cv: data?.cv,
    loading,
    error,
    refetch,
  };
}
