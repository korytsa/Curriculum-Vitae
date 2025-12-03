import type { Skill, SkillCategory } from "@/shared/graphql/generated";

export type AdminSkill = Skill;

export type AdminSkillCategory = SkillCategory;

export interface AdminSkillTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  category: string;
  categoryId?: string | null;
}
