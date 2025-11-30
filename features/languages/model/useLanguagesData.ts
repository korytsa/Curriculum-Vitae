import type { LanguagesWithProfileQuery } from "@/shared/graphql/generated";
import { proficiencyToValue, PROFICIENCY_LEVELS } from "./constants";
import type { LanguageItem } from "./types";

export function useLanguageOptions(data?: LanguagesWithProfileQuery) {
  if (!data?.languages) {
    return [];
  }

  return data.languages
    .filter((language): language is NonNullable<LanguagesWithProfileQuery["languages"][number]> => Boolean(language))
    .map((language) => ({
      value: language.name,
      label: language.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function useDisplayLanguages(data?: LanguagesWithProfileQuery) {
  const languages = data?.profile?.languages ?? [];
  if (languages.length === 0) {
    return [];
  }

  const items = languages.map((language): LanguageItem => {
    const value = proficiencyToValue(language.proficiency);
    return {
      id: `${language.name}-${language.proficiency}`,
      name: language.name,
      proficiency: language.proficiency,
      value,
    };
  });

  const proficiencyOrder = [...PROFICIENCY_LEVELS].reverse();

  return items.sort((a, b) => {
    const orderDiff = proficiencyOrder.indexOf(b.proficiency) - proficiencyOrder.indexOf(a.proficiency);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.name.localeCompare(b.name);
  });
}
