import { useQuery } from "@apollo/client/react";
import { SKILL_CATEGORIES_QUERY, SKILLS_WITH_CATEGORIES_QUERY } from "./graphql";
import type { SkillCategoriesForFormQuery, SkillsWithCategoriesQuery, SkillsWithCategoriesQueryVariables } from "@/shared/graphql/generated";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";

export function useSkills() {
  const { data: categoriesData, loading: categoriesLoading } = useQuery<SkillCategoriesForFormQuery>(SKILL_CATEGORIES_QUERY);

  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const {
    data: skillsData,
    loading: skillsLoading,
    refetch: refetchSkills,
  } = useQuery<SkillsWithCategoriesQuery, SkillsWithCategoriesQueryVariables>(SKILLS_WITH_CATEGORIES_QUERY, {
    variables: { userId: userId || "" },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  return {
    categoriesData,
    skillsData,
    categoriesLoading,
    skillsLoading,
    refetchSkills,
  };
}
