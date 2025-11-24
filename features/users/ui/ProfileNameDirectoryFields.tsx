import type { ChangeEventHandler } from "react";
import { cn } from "@/shared/lib";
import { Input, Select, type SelectOption } from "@/shared/ui";

type TextFieldConfig = {
  id?: string;
  name?: string;
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

type SelectFieldConfig = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
};

type ProfileNameDirectoryFieldsProps = {
  className?: string;
  gridClassName?: string;
  firstNameField: TextFieldConfig;
  lastNameField: TextFieldConfig;
  departmentField: SelectFieldConfig;
  positionField: SelectFieldConfig;
};

export function ProfileNameDirectoryFields({
  className,
  gridClassName = "grid gap-8 md:grid-cols-2",
  firstNameField,
  lastNameField,
  departmentField,
  positionField,
}: ProfileNameDirectoryFieldsProps) {
  return (
    <div className={cn("space-y-10", className)}>
      <div className={gridClassName}>
        <Input {...firstNameField} />
        <Input {...lastNameField} />
      </div>
      <div className={gridClassName}>
        <Select {...departmentField} />
        <Select {...positionField} />
      </div>
    </div>
  );
}
