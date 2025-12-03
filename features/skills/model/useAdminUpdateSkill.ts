import { useSafeMutation } from "@/shared/lib";
import { ADMIN_UPDATE_SKILL_MUTATION, ADMIN_SKILLS_QUERY } from "./graphql";
import type { UpdateSkillInput, Skill } from "@/shared/graphql/generated";

export type AdminUpdateSkillPayload = UpdateSkillInput;

interface UpdateSkillMutationData {
  updateSkill: Skill;
}

interface UpdateSkillMutationVariables {
  skill: UpdateSkillInput;
}

export function useAdminUpdateSkill() {
  const { mutate, loading, error } = useSafeMutation<UpdateSkillMutationData, UpdateSkillMutationVariables>(ADMIN_UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const handleUpdateSkill = async (payload: AdminUpdateSkillPayload) =>
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
