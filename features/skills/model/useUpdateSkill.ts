import { useMutation } from '@apollo/client/react';
import { UPDATE_SKILL_MUTATION, SKILLS_WITH_CATEGORIES_QUERY } from './graphql';

export function useUpdateSkill() {
  const [updateSkill, { loading, error }] = useMutation(UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const handleUpdateSkill = async (
    skillId: string,
    name: string,
    categoryId?: number
  ) => {
    return updateSkill({
      variables: {
        skill: {
          skillId,
          name: name.trim(),
          ...(categoryId && { categoryId }),
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

