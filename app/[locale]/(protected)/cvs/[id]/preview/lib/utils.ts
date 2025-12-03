import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCv } from "@/features/cvs";
import previewI18n from "@/shared/lib/preview-i18n";
import type { SkillMastery } from "@/shared/graphql/generated";
import type { BuildPreviewDerivedDataOptions, CvPreviewDerivedData, CvPreviewProject, MasteryPriorityMap, SkillsByCategory, SkillRow, SupportedLanguage } from "../types";
import type { TFunction } from "i18next";

export const SUPPORTED_LANGUAGES = ["en", "ru"] as const;

const MASTERY_PRIORITY: MasteryPriorityMap = {
  Expert: 1,
  Advanced: 2,
  Proficient: 3,
  Competent: 4,
  Novice: 5,
};

export const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
};

const createDateFormatter = (locale?: string) => {
  const isValidLocale = locale && Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0;
  const dateFormatter = new Intl.DateTimeFormat(isValidLocale ? locale : undefined, {
    month: "short",
    year: "numeric",
  });

  return (value?: string | null): string => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return dateFormatter.format(date);
  };
};

const createDateRangeFormatter = (formatDate: (value?: string | null) => string, presentLabel: string, unknownLabel: string) => {
  return (start?: string | null, end?: string | null): string => {
    const startLabel = start ? formatDate(start) : unknownLabel;
    const endLabel = formatDate(end) || presentLabel;
    return `${startLabel} — ${endLabel}`;
  };
};

const getProfileName = (cv: BuildPreviewDerivedDataOptions["cv"], t: BuildPreviewDerivedDataOptions["t"]): string => {
  const fullName = cv?.user?.profile?.full_name?.trim();
  if (fullName) return fullName;

  const firstName = cv?.user?.profile?.first_name?.trim();
  const lastName = cv?.user?.profile?.last_name?.trim();
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ");

  return fallbackName || cv?.name || t("cvs.details.placeholders.preview");
};

const extractUniqueDomains = (projects: CvPreviewProject[]): string[] => {
  const domains = projects.map((project) => project.domain).filter((domain): domain is string => Boolean(domain));

  return Array.from(new Set(domains));
};

const calculateLatestSkillUsage = (projects: CvPreviewProject[], formatDate: (value?: string | null) => string, presentLabel: string): string | null => {
  if (projects.length === 0) return null;

  const hasOngoingProject = projects.some((project) => !project.end_date);
  if (hasOngoingProject) return presentLabel;

  const endDates = projects
    .map((project) => project.end_date && Date.parse(project.end_date))
    .filter((timestamp): timestamp is number => Boolean(timestamp) && !Number.isNaN(timestamp));

  if (endDates.length === 0) return null;

  const latestTimestamp = Math.max(...endDates);
  return formatDate(new Date(latestTimestamp).toISOString());
};

const translateCategoryName = (categoryName: string, t: TFunction): string => {
  const translationKey = `skills.categories.${categoryName}`;
  const translated = t(translationKey);
  return translated !== translationKey ? translated : categoryName;
};

const sortSkillsByMastery = (skills: SkillMastery[]): SkillMastery[] => {
  if (skills.length === 0) return [];

  return [...skills].sort((a, b) => {
    const priorityA = MASTERY_PRIORITY[a.mastery] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = MASTERY_PRIORITY[b.mastery] ?? Number.MAX_SAFE_INTEGER;

    return priorityA !== priorityB ? priorityA - priorityB : a.name.localeCompare(b.name);
  });
};

const groupSkillsByCategory = (skills: SkillMastery[], skillCategories: BuildPreviewDerivedDataOptions["skillCategories"], t: TFunction): SkillsByCategory[] => {
  if (!skillCategories || skills.length === 0) return [];

  const categoryNameMap = Object.fromEntries(skillCategories.map((category) => [category.id, category.name]));

  const categoryMap = new Map<string, SkillMastery[]>();

  for (const skill of skills) {
    if (!skill.categoryId) continue;

    const categoryName = categoryNameMap[String(skill.categoryId)] || "Other";

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }

    categoryMap.get(categoryName)!.push(skill);
  }

  return Array.from(categoryMap.entries())
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([categoryName, categorySkills]) => ({
      categoryName: translateCategoryName(categoryName, t),
      skills: categorySkills.sort((a, b) => a.name.localeCompare(b.name)),
    }));
};

const createSkillRowKey = (categoryName: string, skillName: string, mastery: string): string => {
  return `${categoryName}-${skillName}-${mastery}`;
};

export const buildSkillRows = (skillsByCategory: SkillsByCategory[], sortedSkills: SkillMastery[], t: TFunction): SkillRow[] => {
  if (skillsByCategory.length > 0) {
    return skillsByCategory.flatMap((category) =>
      category.skills.map((skill, index) => ({
        skill,
        showCategoryLabel: index === 0,
        categoryLabel: category.categoryName,
        key: createSkillRowKey(category.categoryName, skill.name, skill.mastery),
      }))
    );
  }

  return sortedSkills.map((skill) => ({
    skill,
    categoryLabel: "",
    showCategoryLabel: false,
    key: createSkillRowKey("", skill.name, skill.mastery),
  }));
};

export const buildPreviewDerivedData = ({ cv, skillCategories, locale, t }: BuildPreviewDerivedDataOptions): CvPreviewDerivedData => {
  const emptyValueLabel = t("cvs.list.columns.emptyValue");
  const presentLabel = t("cvs.projectsPage.table.labels.present");
  const formatDate = createDateFormatter(locale);

  const projects: CvPreviewProject[] = cv?.projects ?? [];
  const skills = cv?.skills ?? [];

  return {
    projects,
    emptyValueLabel,
    name: cv?.name?.trim() || "",
    profileName: getProfileName(cv, t),
    languagesList: cv?.languages ?? [],
    domainList: extractUniqueDomains(projects),
    sortedSkills: sortSkillsByMastery(skills),
    roleTitle: cv?.user?.position_name ?? t("users.table.columns.position"),
    summaryText: cv?.description?.trim() || t("cvs.preview.summaryPlaceholder"),
    educationValue: cv?.education?.trim() || emptyValueLabel,
    skillsByCategory: groupSkillsByCategory(skills, skillCategories, t),
    latestSkillUsage: calculateLatestSkillUsage(projects, formatDate, presentLabel),
    formatDateRangeLabel: createDateRangeFormatter(formatDate, presentLabel, t("cvs.preview.dateUnknown")),
  };
};

export function useCvPreview(): CvPreviewDerivedData {
  const params = useParams();
  const id = params?.id as string | undefined;
  const locale = params?.locale as string | undefined;
  const { t } = useTranslation(undefined, { i18n: previewI18n });
  const { cv, skillCategories } = useCv(id || "");

  return buildPreviewDerivedData({ cv, skillCategories, locale, t });
}
