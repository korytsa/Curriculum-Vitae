import type { CvProject } from "@/shared/graphql/generated";
import type { SearchInputProps, TableProps } from "@/shared/ui";
import type { DeleteProjectModalState } from "./useDeleteProjectModal";

export type ProjectsPageResult = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  handleAddProject: () => void;
  deleteProjectModal: DeleteProjectModalState;
};

