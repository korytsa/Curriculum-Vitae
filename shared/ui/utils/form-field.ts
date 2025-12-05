export const getLabelColor = (error?: string, isActive?: boolean): string => {
  return error || isActive ? "text-red-500" : "text-[var(--color-text-subtle)]";
};

export const getBorderColor = (error?: string, isActive?: boolean, isInteractive: boolean = true): string => {
  if (error || isActive) {
    return "border-red-500";
  }
  const baseBorder = "border-[var(--color-border)]";
  return isInteractive ? `${baseBorder} hover:border-[var(--color-border-hover)]` : baseBorder;
};
