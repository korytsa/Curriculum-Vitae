import { useMutation } from "@apollo/client/react";
import { CREATE_SKILL_MUTATION, SKILLS_WITH_CATEGORIES_QUERY } from "./graphql";

export function useCreateSkill() {
  const [createSkill, { loading, error }] = useMutation(CREATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleCreateSkill = async (name: string, categoryId: number) => {
    return createSkill({
      variables: {
        skill: {
          name: name.trim(),
          categoryId,
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
