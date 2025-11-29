export interface SelectOption {
  value: string;
  label: string;
  isGroupHeader?: boolean;
}

export const findSelectedOption = (options: SelectOption[], value?: string): SelectOption | undefined => {
  return options.find((opt) => opt.value === value && !opt.isGroupHeader);
};

export const isNoOptionLabel = (label?: string): boolean => {
  if (!label) return false;
  const normalized = label.trim().toLowerCase();
  if (!normalized) return false;

  if (normalized === "no") {
    return true;
  }

  return normalized.startsWith("no ") || normalized.startsWith("no-") || normalized.startsWith("no_");
};

export const isNoSelectionValue = (value?: string, selectedOption?: SelectOption): boolean => {
  if (!value) return true;
  if (!selectedOption) return false;

  return isNoOptionLabel(selectedOption.label);
};

export const getDisplayValue = (selectedOption?: SelectOption, isNoSelection?: boolean): string => {
  if (selectedOption && !isNoSelection) {
    return selectedOption.label;
  }
  return "";
};

export const hasValue = (value?: string, selectedOption?: SelectOption, isNoSelection?: boolean): boolean => {
  return Boolean(value && selectedOption && !isNoSelection);
};

export const isLabelActive = (isFocused: boolean, hasValueOption: boolean, isOpen: boolean): boolean => {
  return isFocused || hasValueOption || isOpen;
};

export const isActive = (isFocused: boolean, isOpen: boolean): boolean => {
  return isFocused || isOpen;
};
