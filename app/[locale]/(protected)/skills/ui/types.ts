import type { TableProps } from "@/shared/ui";
import type { SkillCategory } from "@/features/skills";

export interface AdminSkillsPageViewProps {
  heading: string;
  createButtonLabel: string;
  searchInputProps: any;
  onOpenCreateForm: () => void;
  tableProps: TableProps<any>;
}

export interface SkillsPageViewProps {
  skillsLoading: boolean;
  displayCategories: SkillCategory[];
  showAddSkillForm: boolean;
  isDeleteMode: boolean;
  selectedSkillIds: Set<string>;
  deleteLoading?: boolean;
  onOpenAddForm: () => void;
  onToggleDeleteMode: () => void;
  onToggleSkillSelection: (skillId: string) => void;
  onDeleteSelectedSkills: () => void;
  onCloseAddForm: () => void;
  showHeading?: boolean;
}
