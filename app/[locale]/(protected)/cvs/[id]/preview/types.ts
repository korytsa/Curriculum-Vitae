import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import type { CvProject, CvQuery, Mastery, SkillMastery, SkillCategory } from "@/shared/graphql/generated";

export type CvPreviewPageProps = {
  params: { locale: string; id: string };
};

export type DetailItemProps = {
  label: string;
  children: ReactNode;
};

export type SupportedLanguage = "en" | "ru";

export type MasteryPriorityMap = Record<Mastery, number>;

export type CvEntity = NonNullable<CvQuery["cv"]>;

export type SkillsByCategory = {
  categoryName: string;
  skills: SkillMastery[];
};

export type SkillRow = {
  key: string;
  skill: SkillMastery;
  categoryLabel: string;
  showCategoryLabel: boolean;
};

export type CvPreviewDerivedData = {
  name: string;
  profileName: string;
  roleTitle: string;
  summaryText: string;
  educationValue: string;
  languagesList: CvEntity["languages"];
  domainList: string[];
  projects: CvProject[];
  sortedSkills: SkillMastery[];
  skillsByCategory: SkillsByCategory[];
  latestSkillUsage: string | null;
  formatDateRangeLabel: (start?: string | null, end?: string | null) => string;
  emptyValueLabel: string;
};

export type BuildPreviewDerivedDataOptions = {
  cv?: CvEntity | null;
  skillCategories?: CvQuery["skillCategories"];
  locale?: string;
  t: TFunction;
};
