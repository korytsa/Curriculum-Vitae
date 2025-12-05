import { useMemo } from "react";
import type { SkillsWithCategoriesQuery } from "@/shared/graphql/generated";
import type { SkillOption, SelectOption } from "../types";

export function useSkillSelectOptions(skillsData?: SkillsWithCategoriesQuery): {
  skillOptions: SkillOption[];
  selectOptions: SelectOption[];
} {
  const skillOptions = useMemo<SkillOption[]>(() => {
    if (!skillsData?.skills || !skillsData?.skillCategories) return [];

    const childToParentMap = new Map<string, { id: string; name: string }>();
    const categoriesMap = new Map<string, { id: string; name: string; parent?: { id: string; name: string } | null }>();

    skillsData.skillCategories.forEach((cat) => {
      if (cat) {
        categoriesMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          parent: cat.parent,
        });
        if (cat.parent) {
          childToParentMap.set(cat.id, {
            id: cat.parent.id,
            name: cat.parent.name,
          });
        }
      }
    });

    return skillsData.skills
      .filter((skill) => skill.category)
      .map((skill) => {
        const categoryId = skill.category?.id || "";
        let parentCategory = categoriesMap.get(categoryId);

        if (childToParentMap.has(categoryId)) {
          const parent = childToParentMap.get(categoryId)!;
          parentCategory = {
            id: parent.id,
            name: parent.name,
            parent: null,
          };
        }

        return {
          value: `${skill.id}|${categoryId}`,
          label: skill.name,
          categoryId: parentCategory?.id || categoryId,
          categoryName: parentCategory?.name || skill.category?.name || "",
        };
      })
      .sort((a, b) => {
        if (a.categoryName !== b.categoryName) {
          return a.categoryName.localeCompare(b.categoryName);
        }
        return a.label.localeCompare(b.label);
      });
  }, [skillsData]);

  const selectOptions = useMemo<SelectOption[]>(() => {
    const grouped: Record<string, SkillOption[]> = {};

    skillOptions.forEach((option) => {
      if (!grouped[option.categoryName]) {
        grouped[option.categoryName] = [];
      }
      grouped[option.categoryName].push(option);
    });

    const result: SelectOption[] = [];

    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([categoryName, options]) => {
        result.push({
          value: `group-${categoryName}`,
          label: categoryName,
          isGroupHeader: true,
        });
        options.forEach((option) => {
          result.push({
            value: option.value,
            label: option.label,
          });
        });
      });

    return result;
  }, [skillOptions]);

  return { skillOptions, selectOptions };
}
