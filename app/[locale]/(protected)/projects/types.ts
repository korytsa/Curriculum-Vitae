import type { SearchInputProps, TableProps } from "@/shared/ui";
import type { CvProject } from "@/shared/graphql/generated";

export type ProjectsPageProps = {
  params: { locale: string; id?: string };
};

export type ProjectFormPayload = {
  name: string;
  domain: string;
  startDate: string;
  endDate?: string;
  description: string;
  environment: string[];
};

export type ProjectFormState = {
  name: string;
  domain: string;
  startDate: string;
  endDate: string;
  description: string;
  environment: string[];
};

export type ProjectModalMode = "add" | "update";

export type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: ProjectFormPayload) => Promise<void>;
  initialProject?: ProjectFormPayload;
  mode?: ProjectModalMode;
};

export type UseProjectFormParams = {
  onClose: () => void;
  onSubmit?: (payload: ProjectFormState) => Promise<void> | void;
  initialProject?: ProjectFormPayload;
};

export type UseProjectFormResult = {
  formState: ProjectFormState;
  handleFieldChange: <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  isSubmitting: boolean;
  disableSubmit: boolean;
};

export type UseProjectsPageParams = {
  locale: string;
};

export type CreateProjectModalConfig = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProjectFormPayload) => Promise<void>;
  initialProject?: ProjectFormPayload;
  mode?: ProjectModalMode;
};

export type DeleteProjectModalConfig = {
  open: boolean;
  projectName?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
};

export type UseProjectsPageResult = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  handleAddProject: () => void;
  createProjectModal: CreateProjectModalConfig;
  deleteProjectModal: DeleteProjectModalConfig;
};
