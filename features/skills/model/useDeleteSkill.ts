import { useMutation } from "@apollo/client/react";
import { DELETE_SKILL_MUTATION, SKILLS_WITH_CATEGORIES_QUERY } from "./graphql";

export function useDeleteSkill() {
  const [deleteSkill, { loading, error }] = useMutation(DELETE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleDeleteSkill = async (skillId: string) => {
    return deleteSkill({
      variables: {
        skill: {
          skillId,
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
