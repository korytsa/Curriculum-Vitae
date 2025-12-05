import { useQuery } from "@apollo/client/react";
import { ADMIN_SKILLS_QUERY } from "./graphql";
import type { AdminSkillsQuery } from "@/shared/graphql/generated";

export function useAdminSkills() {
  const {
    data: adminSkillsData,
    loading: adminSkillsLoading,
    refetch: refetchAdminSkills,
  } = useQuery<AdminSkillsQuery>(ADMIN_SKILLS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return {
    adminSkillsData,
    adminSkillsLoading,
    refetchAdminSkills,
  };
}
