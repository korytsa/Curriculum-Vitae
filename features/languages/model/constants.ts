import type { Proficiency } from "@/shared/graphql/generated";

export const PROFICIENCY_LEVELS: Proficiency[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
];

const PROFICIENCY_VALUE_MAP: Record<Proficiency, number> = {
  A1: 2,
  A2: 3,
  B1: 5,
  B2: 7,
  C1: 8,
  C2: 9,
  Native: 10,
};

export const DEFAULT_PROFICIENCY: Proficiency = "A1";

export function proficiencyToValue(proficiency: Proficiency): number {
  return PROFICIENCY_VALUE_MAP[proficiency] ?? 0;
}

export const PROFICIENCY_COLOR_CLASSES: Record<Proficiency, string> = {
  A1: "text-gray-400",
  A2: "text-gray-400",
  B1: "text-sky-400",
  B2: "text-sky-500",
  C1: "text-amber-400",
  C2: "text-amber-500",
  Native: "text-red-500",
};
