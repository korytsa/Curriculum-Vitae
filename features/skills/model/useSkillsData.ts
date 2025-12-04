import { useMemo } from "react";
import type { SkillCategory, CategoryOption } from "../types";
import type { SkillCategoriesForFormQuery, SkillsWithCategoriesQuery, Mastery } from "@/shared/graphql/generated";

const masteryToValue = (mastery: Mastery): number => {
  switch (mastery) {
    case "Novice":
      return 2;
    case "Advanced":
      return 4;
    case "Competent":
      return 6;
    case "Proficient":
      return 8;
    case "Expert":
      return 10;
    default:
      return 10;
  }
};

export function useCategoryOptions(categoriesData?: SkillCategoriesForFormQuery): CategoryOption[] {
  if (!categoriesData?.skillCategories || categoriesData.skillCategories.length === 0) {
    return [];
  }

  return categoriesData.skillCategories
    .filter((category): category is NonNullable<typeof category> => category !== null)
    .map((category) => ({
      id: category.id,
      name: category.name,
    }));
}

export function useDisplayCategories(skillsData?: SkillsWithCategoriesQuery): SkillCategory[] {
  return useMemo(() => {
    if (skillsData === undefined) {
      return [];
    }

    const userSkills = skillsData?.profile?.skills || [];
    if (userSkills.length === 0) {
      return [];
    }

    const allCategories = skillsData?.skillCategories?.filter((category): category is NonNullable<typeof category> => category !== null) || [];

    if (allCategories.length === 0) {
      return [
        {
          id: "default",
          name: "All Skills",
          order: 0,
          skills: userSkills.map((skill) => ({
            id: skill.name,
            name: skill.name,
            value: masteryToValue(skill.mastery),
          })),
        },
      ];
    }

    const parentCategories = allCategories.filter((cat) => !cat.parent);
    const childCategories = allCategories.filter((cat) => cat.parent);

    const childToParentMap = new Map<string, string>();
    childCategories.forEach((child) => {
      if (child.parent) {
        childToParentMap.set(child.id, child.parent.id);
      }
    });

    const skillCategoryMap = new Map<string, string>();

    const sortedParentCategories = parentCategories.sort((a, b) => a.order - b.order);

    sortedParentCategories.forEach((parentCat) => {
      userSkills.forEach((skill) => {
        if (!skill.categoryId) return;

        const categoryId = String(skill.categoryId);
        let targetCategoryId = parentCat.id;

        if (childToParentMap.has(categoryId)) {
          targetCategoryId = childToParentMap.get(categoryId)!;
        }

        if ((categoryId === String(parentCat.id) || targetCategoryId === String(parentCat.id)) && !skillCategoryMap.has(skill.name)) {
          skillCategoryMap.set(skill.name, parentCat.id);
        }
      });
    });

    return sortedParentCategories
      .map((parentCat) => {
        const parentSkills = userSkills
          .filter((skill) => {
            if (!skill.categoryId) return false;

            const categoryId = String(skill.categoryId);
            let targetCategoryId = parentCat.id;

            if (childToParentMap.has(categoryId)) {
              targetCategoryId = childToParentMap.get(categoryId)!;
            }

            return (categoryId === String(parentCat.id) || targetCategoryId === String(parentCat.id)) && skillCategoryMap.get(skill.name) === parentCat.id;
          })
          .map((skill) => ({
            id: skill.name,
            name: skill.name,
            value: masteryToValue(skill.mastery),
          }));

        return {
          id: parentCat.id,
          name: parentCat.name,
          order: parentCat.order,
          skills: parentSkills,
        };
      })
      .filter((cat) => cat.skills.length > 0);
  }, [skillsData]);
}

export function useAllSkillsForSelect(displayCategories: SkillCategory[]): Array<{ id: string; name: string; categoryName: string }> {
  return useMemo(() => {
    const skills = displayCategories.flatMap((category) => [
      ...category.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        categoryName: category.name,
      })),
      ...(category.children?.flatMap((child) =>
        child.skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          categoryName: `${category.name} > ${child.name}`,
        }))
      ) || []),
    ]);

    return skills;
  }, [displayCategories]);
}
