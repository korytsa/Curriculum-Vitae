import { useSafeMutation } from "@/shared/lib";
import {
  DELETE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  DeleteSkillMutation,
  DeleteSkillMutationVariables,
  DeleteSkillInput,
} from "@/shared/graphql/generated";

export type DeleteSkillPayload = DeleteSkillInput;

export function useDeleteSkill() {
  const { mutate, loading, error } = useSafeMutation<
    DeleteSkillMutation,
    DeleteSkillMutationVariables
  >(DELETE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleDeleteSkill = async (payload: DeleteSkillPayload) =>
    mutate({
      variables: {
        skill: payload,
      },
    });

  return {
    deleteSkill: handleDeleteSkill,
    loading,
    error,
  };
}
