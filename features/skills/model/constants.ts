import type { Mastery } from "@/shared/graphql/generated";

export const MASTERY_OPTIONS: Array<{ value: Mastery; label: string }> = [
  { value: "Novice", label: "Novice" },
  { value: "Advanced", label: "Advanced" },
  { value: "Competent", label: "Competent" },
  { value: "Proficient", label: "Proficient" },
  { value: "Expert", label: "Expert" },
];
