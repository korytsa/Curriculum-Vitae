import { useSafeMutation } from "@/shared/lib";
import {
  UPDATE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  UpdateSkillMutation,
  UpdateSkillMutationVariables,
  UpdateSkillInput,
} from "@/shared/graphql/generated";

export type UpdateSkillPayload = UpdateSkillInput;

export function useUpdateSkill() {
  const { mutate, loading, error } = useSafeMutation<
    UpdateSkillMutation,
    UpdateSkillMutationVariables
  >(UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleUpdateSkill = async (payload: UpdateSkillPayload) =>
    mutate({
      variables: {
        skill: payload,
      },
    });

  return {
    updateSkill: handleUpdateSkill,
    loading,
    error,
  };
}

