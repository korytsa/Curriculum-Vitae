import { useSafeMutation } from "@/shared/lib";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import {
  ADD_PROFILE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  AddProfileSkillMutation,
  AddProfileSkillMutationVariables,
  AddProfileSkillInput,
} from "@/shared/graphql/generated";

export type CreateSkillPayload = Omit<AddProfileSkillInput, "userId">;

export function useCreateSkill() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const { mutate, loading, error } = useSafeMutation<
    AddProfileSkillMutation,
    AddProfileSkillMutationVariables
  >(ADD_PROFILE_SKILL_MUTATION, {
    refetchQueries: userId
      ? [{ query: SKILLS_WITH_CATEGORIES_QUERY, variables: { userId } }]
      : [],
  });

  const handleCreateSkill = async (payload: CreateSkillPayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        skill: {
          ...payload,
          userId,
        },
      },
    });
  };

  return {
    createSkill: handleCreateSkill,
    loading,
    error,
  };
}
