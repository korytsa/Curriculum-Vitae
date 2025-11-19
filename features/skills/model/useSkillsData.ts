import { useMemo } from "react";
import type {
  SkillCategory,
  SkillsWithCategoriesQueryResult,
  CategoryOption,
} from "./types";

const mockCategoryOptions: CategoryOption[] = [
  { id: "1", name: "Programming languages" },
  { id: "2", name: "Frontend" },
  { id: "3", name: "Backend" },
  { id: "4", name: "Database" },
  { id: "5", name: "DevOps" },
];

const mockDisplayCategories: SkillCategory[] = [
  {
    id: "1",
    name: "Programming languages",
    order: 0,
    skills: [{ id: "mock-1", name: "JavaScript", value: 10 }],
  },
  {
    id: "2",
    name: "Frontend",
    order: 1,
    skills: [
      { id: "mock-2", name: "TypeScript", value: 8 },
      { id: "mock-3", name: "React", value: 6 },
    ],
  },

  {
    id: "4",
    name: "Database",
    order: 3,
    skills: [{ id: "mock-5", name: "GraphQL", value: 2 }],
  },
];

const mockAllSkillsForSelect: Array<{
  id: string;
  name: string;
  categoryName: string;
}> = [
  { id: "mock-1", name: "JavaScript", categoryName: "Programming languages" },
  { id: "mock-2", name: "TypeScript", categoryName: "Frontend" },
  { id: "mock-3", name: "React", categoryName: "Frontend" },
  { id: "mock-5", name: "GraphQL", categoryName: "Database" },
];

export function useCategoryOptions(categoriesData?: {
  skillCategories: CategoryOption[];
}): CategoryOption[] {
  return useMemo(() => {
    if (
      categoriesData?.skillCategories &&
      categoriesData.skillCategories.length > 0
    ) {
      return categoriesData.skillCategories;
    }
    return mockCategoryOptions;
  }, [categoriesData]);
}

export function useDisplayCategories(
  skillsData?: SkillsWithCategoriesQueryResult
): SkillCategory[] {
  return useMemo(() => {
    if (skillsData === undefined) {
      return mockDisplayCategories;
    }

    const allSkills = skillsData?.skills || [];
    const allCategories = skillsData?.skillCategories || [];

    if (allCategories.length === 0 && allSkills.length === 0) {
      return mockDisplayCategories;
    }

    if (allCategories.length === 0 && allSkills.length > 0) {
      return [
        {
          id: "default",
          name: "All Skills",
          order: 0,
          skills: allSkills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            value: 10,
          })),
        },
      ];
    }

    const parentCategories = allCategories.filter((cat) => !cat.parent);
    const childCategories = allCategories.filter((cat) => cat.parent);

    return parentCategories
      .sort((a, b) => a.order - b.order)
      .map((parentCat) => {
        const parentSkills = allSkills
          .filter(
            (skill) =>
              skill.category &&
              String(skill.category.id) === String(parentCat.id)
          )
          .map((skill) => ({
            id: skill.id,
            name: skill.name,
            value: 10,
          }));

        const children = childCategories
          .filter(
            (child) =>
              child.parent && String(child.parent.id) === String(parentCat.id)
          )
          .sort((a, b) => a.order - b.order)
          .map((child) => {
            const childSkills = allSkills
              .filter(
                (skill) =>
                  skill.category &&
                  String(skill.category.id) === String(child.id)
              )
              .map((skill) => ({
                id: skill.id,
                name: skill.name,
                value: 10,
              }));

            return {
              id: child.id,
              name: child.name,
              order: child.order,
              skills: childSkills,
            };
          });

        return {
          id: parentCat.id,
          name: parentCat.name,
          order: parentCat.order,
          skills: parentSkills,
          children: children.length > 0 ? children : undefined,
        };
      })
      .filter(
        (cat) =>
          cat.skills.length > 0 ||
          cat.children?.some((child) => child.skills.length > 0)
      );
  }, [skillsData]);
}

export function useAllSkillsForSelect(
  displayCategories: SkillCategory[]
): Array<{ id: string; name: string; categoryName: string }> {
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

    if (skills.length === 0) {
      return mockAllSkillsForSelect;
    }

    return skills;
  }, [displayCategories]);
}
