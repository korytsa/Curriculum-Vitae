import type { Project } from "@/shared/graphql/generated";
import type { ProjectFormState } from "./types";

export const DEFAULT_SORT_DIRECTION: "asc" | "desc" = "desc";

export const PROJECTS_SEARCH_FIELDS = ["project.name"] as const;

export const EMPTY_PROJECTS: Project[] = [];

export const PROJECT_FORM_INITIAL_STATE: ProjectFormState = {
  name: "",
  domain: "",
  startDate: "",
  endDate: "",
  description: "",
  environment: [],
};

export const FORM_FIELDS = {
  descriptionRows: 5,
  environmentRows: 3,
} as const;

export const TABLE_CONFIG = {
  menuWidth: "155px",
  iconClassName: "w-5 h-5 text-white",
  buttonClassName: "text-white hover:bg-white/10",
  mobileSummaryKeys: ["name", "end_date"],
} as const;

export const SORT_CONFIG = {
  defaultDirection: "desc" as const,
} as const;

export const TECHNOLOGY_OPTIONS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Redux",
  "Redux-Saga",
  "Formik",
  "React Hook Form",
  "SCSS",
  "SASS",
  "Firebase",
  "Zustand",
  "React Flow",
  "Vue.js",
  "Angular",
  "Next.js",
  "Node.js",
  "Express",
  "NestJS",
  "GraphQL",
  "Apollo",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Git",
  "Webpack",
  "Vite",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Tailwind CSS",
  "Material-UI",
  "Ant Design",
  "Bootstrap",
  "jQuery",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
] as const;

