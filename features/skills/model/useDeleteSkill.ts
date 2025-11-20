import { useSafeMutation } from "@/shared/lib";
import {
  DELETE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";

export type DeleteSkillPayload = {
  skillId: string;
};

export function useDeleteSkill() {
  const { mutate, loading, error } = useSafeMutation(DELETE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleDeleteSkill = async (payload: DeleteSkillPayload) => {
    return mutate({
      variables: {
        skill: {
          skillId: payload.skillId,
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
