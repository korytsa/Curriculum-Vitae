import { useQuery } from "@apollo/client/react";
import {
  SKILL_CATEGORIES_QUERY,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  SkillCategoriesQueryResult,
  SkillsWithCategoriesQueryResult,
} from "./types";

export function useSkills() {
  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<SkillCategoriesQueryResult>(SKILL_CATEGORIES_QUERY);

  const {
    data: skillsData,
    loading: skillsLoading,
    refetch: refetchSkills,
  } = useQuery<SkillsWithCategoriesQueryResult>(SKILLS_WITH_CATEGORIES_QUERY, {
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
