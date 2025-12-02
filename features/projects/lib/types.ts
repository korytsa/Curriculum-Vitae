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

export type UseProjectsPageResult = import("./page-types").ProjectsPageResult & {
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

export type UseCvProjectsPageResult = import("./page-types").ProjectsPageResult & {
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
