import { useSafeMutation } from "@/shared/lib";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import {
  DELETE_PROFILE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  DeleteProfileSkillMutation,
  DeleteProfileSkillMutationVariables,
  DeleteProfileSkillInput,
  SkillsWithCategoriesQueryVariables,
} from "@/shared/graphql/generated";

export type DeleteSkillPayload = {
  name: string[];
};

export function useDeleteSkill() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const { mutate, loading, error } = useSafeMutation<
    DeleteProfileSkillMutation,
    DeleteProfileSkillMutationVariables
  >(DELETE_PROFILE_SKILL_MUTATION, {
    refetchQueries: userId
      ? [
          {
            query: SKILLS_WITH_CATEGORIES_QUERY,
            variables: { userId } as SkillsWithCategoriesQueryVariables,
          },
        ]
      : [],
  });

  const handleDeleteSkill = async (payload: DeleteSkillPayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        skill: {
          name: payload.name,
          userId,
        },
      },
    });
  };

  return {
    deleteSkill: handleDeleteSkill,
    loading,
    error,
  };
}
