import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import type { AdminSkill, AdminSkillTableRow } from "../types";

export function getUserId(): string | null {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  return decodedToken?.sub?.toString() || null;
}

export function mapSkillToTableRow(skill: AdminSkill): AdminSkillTableRow {
  return {
    id: skill.id,
    name: skill.name,
    type: skill.category_parent_name || skill.category?.name || "",
    category: skill.category_name || skill.category?.name || "",
    categoryId: skill.category?.id || null,
  };
}
