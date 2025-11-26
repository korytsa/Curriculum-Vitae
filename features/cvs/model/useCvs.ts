import { useQuery } from "@apollo/client/react";
import { CVS_QUERY } from "./graphql";
import type { CvsQuery, CvsQueryVariables } from "@/shared/graphql/generated";

export type CvListItem = CvsQuery["cvs"][number];

export function useCvs() {
  const { data, loading, error, refetch } = useQuery<
    CvsQuery,
    CvsQueryVariables
  >(CVS_QUERY);

  const cvs = (data?.cvs ?? []) as CvListItem[];

  return {
    cvs,
    loading,
    error,
    refetch,
  };
}
