export type SkillItem = {
  id: string;
  name: string;
  value: number;
};

export type SkillCategory = {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
  children?: SkillCategory[];
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type SkillCategoriesQueryResult = {
  skillCategories: CategoryOption[];
};

export type SkillFromBackend = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  } | null;
};

export type CategoryFromBackend = {
  id: string;
  name: string;
  order: number;
  parent: {
    id: string;
    name: string;
  } | null;
};

export type SkillsWithCategoriesQueryResult = {
  skillCategories: CategoryFromBackend[];
  skills: SkillFromBackend[];
};
