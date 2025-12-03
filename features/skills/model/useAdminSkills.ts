import { useQuery } from "@apollo/client/react";
import { ADMIN_SKILLS_QUERY } from "./graphql";
import type { Skill, SkillCategory } from "@/shared/graphql/generated";

interface AdminSkillsQueryData {
  skills: Skill[];
  skillCategories: SkillCategory[];
}

export function useAdminSkills() {
  const {
    data: adminSkillsData,
    loading: adminSkillsLoading,
    refetch: refetchAdminSkills,
  } = useQuery<AdminSkillsQueryData>(ADMIN_SKILLS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return {
    adminSkillsData,
    adminSkillsLoading,
    refetchAdminSkills,
  };
}
