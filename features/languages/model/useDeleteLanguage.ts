import { useSafeMutation } from "@/shared/lib";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import {
  DELETE_PROFILE_LANGUAGE_MUTATION,
  LANGUAGES_WITH_PROFILE_QUERY,
} from "./graphql";
import type {
  DeleteProfileLanguageMutation,
  DeleteProfileLanguageMutationVariables,
  LanguagesWithProfileQueryVariables,
} from "@/shared/graphql/generated";

export type DeleteLanguagePayload = {
  name: string[];
};

export function useDeleteLanguage() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const { mutate, loading, error } = useSafeMutation<
    DeleteProfileLanguageMutation,
    DeleteProfileLanguageMutationVariables
  >(DELETE_PROFILE_LANGUAGE_MUTATION, {
    refetchQueries: userId
      ? [
          {
            query: LANGUAGES_WITH_PROFILE_QUERY,
            variables: { userId } as LanguagesWithProfileQueryVariables,
          },
        ]
      : [],
  });

  const handleDeleteLanguage = async (payload: DeleteLanguagePayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        language: {
          name: payload.name,
          userId,
        },
      },
    });
  };

  return {
    deleteLanguage: handleDeleteLanguage,
    loading,
    error,
  };
}
