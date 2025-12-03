import { useSafeMutation } from "@/shared/lib";
import { CREATE_SKILL_MUTATION, ADMIN_SKILLS_QUERY } from "./graphql";
import type { CreateSkillInput, Skill } from "@/shared/graphql/generated";

export type AdminCreateSkillPayload = CreateSkillInput;

interface CreateSkillMutationData {
  createSkill: Skill;
}

interface CreateSkillMutationVariables {
  skill: CreateSkillInput;
}

export function useAdminCreateSkill() {
  const { mutate, loading, error } = useSafeMutation<CreateSkillMutationData, CreateSkillMutationVariables>(CREATE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const handleCreateSkill = async (payload: AdminCreateSkillPayload) =>
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
