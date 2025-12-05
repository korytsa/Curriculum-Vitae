export const ADMIN_SKILLS_SEARCH_FIELDS = ["name", "type", "category"] as const;

export const ADMIN_SKILL_FORM_INITIAL_STATE = {
  name: "",
  typeId: "",
  categoryId: "",
} as const;

export const TYPE_OPTIONS = [
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
];

export const CATEGORY_OPTIONS = [
  { value: "Backend technologies", label: "Backend technologies" },
  { value: "Cloud", label: "Cloud" },
  { value: "Databases", label: "Databases" },
  { value: "Frontend technologies", label: "Frontend technologies" },
];
