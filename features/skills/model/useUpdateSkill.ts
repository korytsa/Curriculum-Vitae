import { useSafeMutation } from "@/shared/lib";
import {
  UPDATE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";

export type UpdateSkillPayload = {
  skillId: string;
  name: string;
  categoryId?: number;
};

export function useUpdateSkill() {
  const { mutate, loading, error } = useSafeMutation(UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleUpdateSkill = async (payload: UpdateSkillPayload) => {
    return mutate({
      variables: {
        skill: {
          skillId: payload.skillId,
          name: payload.name,
          ...(payload.categoryId && { categoryId: payload.categoryId }),
        },
      },
    });
  };

  return {
    updateSkill: handleUpdateSkill,
    loading,
    error,
  };
}

