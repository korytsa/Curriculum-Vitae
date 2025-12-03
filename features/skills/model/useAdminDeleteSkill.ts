import { useSafeMutation } from "@/shared/lib";
import { DELETE_SKILL_MUTATION, ADMIN_SKILLS_QUERY } from "./graphql";
import type { DeleteSkillInput, DeleteResult } from "@/shared/graphql/generated";

export type AdminDeleteSkillPayload = DeleteSkillInput;

interface DeleteSkillMutationData {
  deleteSkill: DeleteResult;
}

interface DeleteSkillMutationVariables {
  skill: DeleteSkillInput;
}

export function useAdminDeleteSkill() {
  const { mutate, loading, error } = useSafeMutation<DeleteSkillMutationData, DeleteSkillMutationVariables>(DELETE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const handleDeleteSkill = async (payload: AdminDeleteSkillPayload) =>
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
