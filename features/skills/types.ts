import type { Skill, SkillCategory as GeneratedSkillCategory, CreateSkillInput, UpdateSkillInput, DeleteSkillInput, AddProfileSkillInput } from "@/shared/graphql/generated";
import type { SearchInputProps, TableProps } from "@/shared/ui";

export type SkillItem = {
  id: string;
  name: string;
  value: number;
};

export type SkillCategory = {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
  children?: SkillCategory[];
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type AdminSkill = Skill;

export type AdminSkillCategory = GeneratedSkillCategory;

export interface AdminSkillTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  category: string;
  categoryId?: string | null;
}

export type AdminCreateSkillPayload = CreateSkillInput;
export type AdminUpdateSkillPayload = UpdateSkillInput;
export type AdminDeleteSkillPayload = DeleteSkillInput;
export type CreateSkillPayload = Omit<AddProfileSkillInput, "userId">;
export type UpdateSkillPayload = UpdateSkillInput;
export type DeleteSkillPayload = { name: string[] };

export interface AdminCreateSkillMutationData {
  createSkill: Skill;
}

export interface AdminCreateSkillMutationVariables {
  skill: CreateSkillInput;
}

export interface AdminUpdateSkillMutationData {
  updateSkill: Skill;
}

export interface AdminUpdateSkillMutationVariables {
  skill: UpdateSkillInput;
}

export interface AdminDeleteSkillMutationData {
  deleteSkill: { affected: number };
}

export interface AdminDeleteSkillMutationVariables {
  skill: DeleteSkillInput;
}

export interface SkillOption {
  value: string;
  label: string;
  categoryId: string;
  categoryName: string;
}

export interface SelectOption {
  value: string;
  label: string;
  isGroupHeader?: boolean;
}

export type AdminSkillFormState = {
  name: string;
  typeId: string;
  categoryId: string;
};

export type AdminSkillFormProps = {
  formState: AdminSkillFormState;
  onFieldChange: <K extends keyof AdminSkillFormState>(field: K, value: AdminSkillFormState[K]) => void;
};

export type UseAdminSkillsTableParams = {
  skills: AdminSkill[];
  isLoading?: boolean;
  onEdit: (skill: AdminSkill) => void;
  onDelete: (skill: AdminSkill) => void;
};

export type UseAdminSkillsTableResult = {
  searchInputProps: SearchInputProps<AdminSkillTableRow>;
  tableProps: TableProps<AdminSkillTableRow>;
};

export type UseAdminSkillsPageResult = {
  searchInputProps: SearchInputProps<AdminSkillTableRow>;
  tableProps: TableProps<AdminSkillTableRow>;
  heading: string;
  createButtonLabel: string;
  handleOpenCreateForm: () => void;
  createModal: {
    open: boolean;
    onClose: () => void;
    formState: AdminSkillFormState;
    onFieldChange: <K extends keyof AdminSkillFormState>(field: K, value: AdminSkillFormState[K]) => void;
    onSubmit: () => Promise<void>;
    isLoading: boolean;
    isValid: boolean;
  };
  updateModal: {
    open: boolean;
    onClose: () => void;
    formState: AdminSkillFormState;
    onFieldChange: <K extends keyof AdminSkillFormState>(field: K, value: AdminSkillFormState[K]) => void;
    onSubmit: () => Promise<void>;
    isLoading: boolean;
    isValid: boolean;
  };
  deleteSkillModal: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    skillName?: string;
    isLoading: boolean;
    errorMessage: string | null;
  };
  refetchAdminSkills: () => Promise<any>;
};

export type UseAdminDeleteSkillResult = {
  deleteSkillModal: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    skillName?: string;
    isLoading: boolean;
    errorMessage: string | null;
  };
  handleDeleteRequest: (skill: AdminSkill) => void;
  loading: boolean;
};

export type AdminSkillModalProps = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "update";
  formState: AdminSkillFormState;
  onFieldChange: <K extends keyof AdminSkillFormState>(field: K, value: AdminSkillFormState[K]) => void;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
  isValid?: boolean;
};
