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
