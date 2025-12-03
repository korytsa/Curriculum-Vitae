import type { CvProject, Project } from "@/shared/graphql/generated";
import type { SearchInputProps, TableProps } from "@/shared/ui";

export type ProjectsActiveField = "name" | "domain" | "start_date" | "end_date";

export type ProjectsDirection = "asc" | "desc";

export type ProjectModalMode = "add" | "update";

export type ProjectSearchState = {
  searchInputProps: SearchInputProps<CvProject>;
  filteredProjects: CvProject[];
  hasSearchQuery: boolean;
  handleResetSearch: () => void;
};

export type UseProjectsTableParams = {
  projects: CvProject[];
  locale: string;
  isLoading?: boolean;
  onEdit: (project: CvProject) => void;
  onDelete: (project: CvProject) => void;
  tableConfig?: {
    menuWidth?: string;
    buttonClassName?: string;
    iconClassName?: string;
    mobileSummaryKeys?: string[];
  };
  emptyStateConfig?: {
    showTitle?: boolean;
    emptyTitleKey?: string;
    noResultsTitleKey?: string;
  };
};

export type ProjectsPageProps = {
  params: { locale: string; id?: string };
};

export type CvProjectsPageProps = {
  params: { locale: string; id: string };
};

type BaseProjectForm = {
  domain: string;
  startDate: string;
  description: string;
  environment: string[];
};

export type ProjectFormPayload = BaseProjectForm & {
  name: string;
  endDate?: string;
};

export type ProjectFormState = BaseProjectForm & {
  name: string;
  endDate: string;
};

type BaseModalProps<T> = {
  open: boolean;
  onClose: () => void;
  mode?: ProjectModalMode;
};

export type CreateProjectModalProps = BaseModalProps<ProjectFormPayload> & {
  onSubmit?: (payload: ProjectFormPayload) => Promise<void>;
  initialProject?: ProjectFormPayload;
};

export type UseProjectFormParams = {
  onClose: () => void;
  onSubmit?: (payload: ProjectFormState) => Promise<void> | void;
  initialProject?: ProjectFormPayload;
};

type BaseFormResult<T> = {
  formState: T;
  handleFieldChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  isSubmitting: boolean;
  disableSubmit: boolean;
};

export type UseProjectFormResult = BaseFormResult<ProjectFormState>;

export type UseProjectsPageParams = {
  locale: string;
};

export type CreateProjectModalConfig = BaseModalProps<ProjectFormPayload> & {
  onSubmit: (payload: ProjectFormPayload) => Promise<void>;
  initialProject?: ProjectFormPayload;
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

type BaseAddProjectForm = {
  projectId: string;
  domain: string;
  startDate: string;
  description: string;
  environment: string[];
};

export type AddProjectFormInitialProject = BaseAddProjectForm & {
  endDate?: string;
  responsibilities: string;
};

export type AddProjectFormState = BaseAddProjectForm & {
  endDate: string;
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

export type UseAddProjectFormResult = BaseFormResult<AddProjectFormState> & {
  projectOptions: ProjectOption[];
  handleSubmit: () => Promise<void> | void;
};

export type AddProjectModalProps = BaseModalProps<AddProjectModalSubmitPayload> & {
  projects?: Project[];
  isProjectListLoading?: boolean;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
};

export type UseCvProjectsPageResult = ProjectsPageResult & {
  addProjectModal: BaseModalProps<AddProjectModalSubmitPayload> & {
    projects: Project[];
    isLoading: boolean;
    onSubmit: (payload: AddProjectModalSubmitPayload) => Promise<void>;
    initialProject?: AddProjectFormInitialProject;
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
