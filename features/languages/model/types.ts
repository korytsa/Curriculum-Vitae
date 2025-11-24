import type { Proficiency } from "@/shared/graphql/generated";

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: Proficiency;
  value: number;
}
