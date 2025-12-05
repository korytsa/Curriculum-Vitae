import type { AddProjectFormState, ProjectFormState, ProjectOption, CreateProjectModalProps, AddProjectModalProps } from "@/features/projects";
import type { SearchInputProps, TableProps } from "@/shared/ui";
import type { CvProject } from "@/shared/graphql/generated";

export type UserProjectFormProps = {
  formState: AddProjectFormState;
  projectOptions: ProjectOption[];
  mode: "add" | "update";
  isProjectListLoading?: boolean;
  onFieldChange: <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => void;
};

export type AdminProjectFormProps = {
  formState: ProjectFormState;
  onFieldChange: <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => void;
};

export type UnifiedProjectModalProps =
  | (Omit<AddProjectModalProps, "mode"> & { variant: "add-to-cv"; mode?: "add" | "update" })
  | (Omit<CreateProjectModalProps, "mode"> & { variant: "create"; mode?: "add" | "update" });

export type ProjectsPageLayoutProps = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  onAddProject: () => void;
  deleteModal: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
    errorMessage?: string | null;
    projectName?: string;
  };
  heading?: string;
  renderModal: () => React.ReactNode;
};
