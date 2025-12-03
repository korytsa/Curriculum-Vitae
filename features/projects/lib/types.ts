import type { CvProject, Project } from "@/shared/graphql/generated";
import type { SearchInputProps, TableProps } from "@/shared/ui";

export type ProjectsActiveField = "name" | "domain" | "start_date" | "end_date";

export type ProjectsDirection = "asc" | "desc";

export type ProjectModalMode = "add" | "update";

export type ProjectsPageProps = {
  params: { locale: string; id?: string };
};

export type CvProjectsPageProps = {
  params: { locale: string; id: string };
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

export type ProjectsPageResult = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  handleAddProject: () => void;
  deleteProjectModal: DeleteProjectModalState;
};

export type UseProjectsPageResult = ProjectsPageResult & {
  createProjectModal: CreateProjectModalConfig;
};

export type UseCvProjectsPageParams = {
  cvId: string;
  locale: string;
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
  projects?: import("@/shared/graphql/generated").Project[];
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

export type AddProjectModalProps = {
  open: boolean;
  onClose: () => void;
  projects?: import("@/shared/graphql/generated").Project[];
  isProjectListLoading?: boolean;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
  mode?: ProjectModalMode;
};

export type UseCvProjectsPageResult = ProjectsPageResult & {
  addProjectModal: {
    open: boolean;
    onClose: () => void;
    projects: import("@/shared/graphql/generated").Project[];
    isLoading: boolean;
    onSubmit: (payload: AddProjectModalSubmitPayload) => Promise<void>;
    initialProject?: AddProjectFormInitialProject;
    mode: ProjectModalMode;
  };
};

export type DeleteProjectModalState = {
  open: boolean;
  projectName?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
};

export type UseDeleteProjectParams = {
  cvId?: string;
};

export type UseDeleteProjectResult = {
  deleteProject: (projectId: string, isCvProject?: boolean) => Promise<void>;
  loading: boolean;
  error: Error | null;
  deleteProjectModal: DeleteProjectModalState;
  handleDeleteRequest: (project: CvProject) => void;
};

export type UseAddProjectParams = {
  cvId?: string;
  projects?: Project[];
  onClose?: () => void;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
};

export type UseAddProjectResult = {
  addProject: (payload: ProjectFormPayload | AddProjectModalSubmitPayload, isCvProject?: boolean) => Promise<void>;
  loading: boolean;
  error: Error | null;
  formState?: AddProjectFormState;
  projectOptions?: ProjectOption[];
  handleFieldChange?: <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => void;
  handleSubmit?: () => Promise<void> | void;
  handleClose?: () => void;
  isSubmitting?: boolean;
  disableSubmit?: boolean;
};

export type UseUpdateProjectParams = {
  cvId?: string;
  onClose?: () => void;
  onSubmit?: (payload: ProjectFormState) => Promise<void> | void;
  initialProject?: ProjectFormPayload;
};

export type UseUpdateProjectResult = {
  updateProject: (payload: ProjectFormPayload | AddProjectModalSubmitPayload, isCvProject?: boolean, projectId?: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
  formState?: ProjectFormState;
  handleFieldChange?: <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => void;
  handleSubmit?: () => Promise<void>;
  handleClose?: () => void;
  isSubmitting?: boolean;
  disableSubmit?: boolean;
};
