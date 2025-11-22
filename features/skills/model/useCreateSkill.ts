import { useSafeMutation } from "@/shared/lib";
import {
  CREATE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  CreateSkillMutation,
  CreateSkillMutationVariables,
  CreateSkillInput,
} from "@/shared/graphql/generated";

export type CreateSkillPayload = CreateSkillInput;

export function useCreateSkill() {
  const { mutate, loading, error } = useSafeMutation<
    CreateSkillMutation,
    CreateSkillMutationVariables
  >(CREATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleCreateSkill = async (payload: CreateSkillPayload) =>
    mutate({
      variables: {
        skill: payload,
      },
    });

  return {
    createSkill: handleCreateSkill,
    loading,
    error,
  };
}
