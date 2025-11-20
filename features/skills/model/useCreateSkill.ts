import { useSafeMutation } from "@/shared/lib";
import {
  CREATE_SKILL_MUTATION,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";

export type CreateSkillPayload = {
  name: string;
  categoryId: number;
};

export function useCreateSkill() {
  const { mutate, loading, error } = useSafeMutation(CREATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleCreateSkill = async (payload: CreateSkillPayload) => {
    return mutate({
      variables: {
        skill: {
          name: payload.name,
          categoryId: payload.categoryId,
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
