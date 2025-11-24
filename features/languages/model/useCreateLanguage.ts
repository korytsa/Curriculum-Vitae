import { useSafeMutation } from "@/shared/lib";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import {
  ADD_PROFILE_LANGUAGE_MUTATION,
  LANGUAGES_WITH_PROFILE_QUERY,
} from "./graphql";
import type {
  AddProfileLanguageInput,
  AddProfileLanguageMutation,
  AddProfileLanguageMutationVariables,
  LanguagesWithProfileQueryVariables,
} from "@/shared/graphql/generated";

export type CreateLanguagePayload = Omit<AddProfileLanguageInput, "userId">;

export function useCreateLanguage() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const { mutate, loading, error } = useSafeMutation<
    AddProfileLanguageMutation,
    AddProfileLanguageMutationVariables
  >(ADD_PROFILE_LANGUAGE_MUTATION, {
    refetchQueries: userId
      ? [
          {
            query: LANGUAGES_WITH_PROFILE_QUERY,
            variables: { userId } as LanguagesWithProfileQueryVariables,
          },
        ]
      : [],
  });

  const handleCreateLanguage = async (payload: CreateLanguagePayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        language: {
          ...payload,
          userId,
        },
      },
    });
  };

  return {
    createLanguage: handleCreateLanguage,
    loading,
    error,
  };
}
