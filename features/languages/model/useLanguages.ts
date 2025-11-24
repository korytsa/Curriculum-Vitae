import { useQuery } from "@apollo/client/react";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { LANGUAGES_WITH_PROFILE_QUERY } from "./graphql";
import type {
  LanguagesWithProfileQuery,
  LanguagesWithProfileQueryVariables,
} from "@/shared/graphql/generated";

export function useLanguages() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const {
    data: languagesData,
    loading: languagesLoading,
    refetch: refetchLanguages,
  } = useQuery<LanguagesWithProfileQuery, LanguagesWithProfileQueryVariables>(
    LANGUAGES_WITH_PROFILE_QUERY,
    {
      variables: { userId: userId || "" },
      skip: !userId,
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    languagesData,
    languagesLoading,
    refetchLanguages,
  };
}
