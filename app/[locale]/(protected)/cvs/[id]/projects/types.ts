import type { ReactNode } from "react";
import type { CvProject, Project } from "@/shared/graphql/generated";
import type { SearchInputProps, TableColumn, TableProps } from "@/shared/ui";

export type CvProjectsPageProps = {
  params: { locale: string; id: string };
};

export type CvProjectsActiveField = "name" | "domain" | "start_date" | "end_date";

export type CvProjectsDirection = "asc" | "desc";

export type ProjectModalMode = "add" | "update";

export type ProjectSearchState = {
  searchInputProps: SearchInputProps<CvProject>;
  filteredProjects: CvProject[];
  hasSearchQuery: boolean;
  handleResetSearch: () => void;
};

export type UseCvProjectsPageParams = {
  cvId: string;
  locale?: string;
};

export type UseCvProjectsPageResult = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  handleAddProject: () => void;
  addProjectModal: {
    open: boolean;
    onClose: () => void;
    projects: Project[];
    isLoading: boolean;
    onSubmit: (payload: AddProjectModalSubmitPayload) => Promise<void>;
    initialProject?: AddProjectFormInitialProject;
    mode: ProjectModalMode;
  };
  deleteProjectModal: {
    open: boolean;
    projectName?: string;
    onConfirm: () => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
    errorMessage?: string | null;
  };
};

export type AddProjectModalSubmitPayload = {
  projectId: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
};

export type AddProjectFormInitialProject = {
  projectId: string;
  domain: string;
  startDate: string;
  endDate?: string;
  description: string;
  environment: string[];
  responsibilities: string;
};

export type AddProjectFormState = {
  projectId: string;
  domain: string;
  startDate: string;
  endDate: string;
  description: string;
  environment: string[];
  responsibilities: string;
};

export type ProjectOption = {
  value: string;
  label: string;
};

export type UseAddProjectFormParams = {
  projects?: Project[];
  onClose: () => void;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
};

export type UseAddProjectFormResult = {
  formState: AddProjectFormState;
  projectOptions: ProjectOption[];
  handleFieldChange: <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => void;
  handleSubmit: () => Promise<void> | void;
  handleClose: () => void;
  isSubmitting: boolean;
  disableSubmit: boolean;
};

export type SortableColumnConfig = {
  key: CvProjectsActiveField;
  label: string;
  ariaLabel: string;
  onToggle: () => void;
  className?: string;
  render: TableColumn<CvProject>["render"];
};

export type AddProjectModalProps = {
  open: boolean;
  onClose: () => void;
  projects?: Project[];
  isProjectListLoading?: boolean;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
  mode?: ProjectModalMode;
};
