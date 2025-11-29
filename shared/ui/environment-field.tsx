import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";
import { IoCloseCircle } from "react-icons/io5";
import { cn } from "@/shared/lib";

type SelectLikeFieldProps = {
  label: string;
  isActive: boolean;
  children: ReactNode;
};

type EnvironmentFieldProps = {
  label: string;
  values: string[];
};

const FieldLabel = ({ label, isActive }: { label: string; isActive: boolean }) => (
  <label
    className={cn(
      "absolute left-3 px-2 transition-all duration-200 text-[var(--color-disabled-text)] bg-[var(--color-bg)]",
      isActive ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2"
    )}
  >
    {label}
  </label>
);

const ValuePill = ({ value }: { value: string }) => (
  <span className="flex items-center gap-1 rounded-full bg-[#424242] px-2 py-1 text-xs text-white/30">
    {value}
    <IoCloseCircle className="size-4 text-white/10" />
  </span>
);

const ValuesList = ({ values }: { values: string[] }) =>
  values.length ? (
    <div className="flex flex-wrap items-center gap-2">
      {values.map((value) => (
        <ValuePill key={value} value={value} />
      ))}
    </div>
  ) : (
    <span className="select-none text-transparent">.</span>
  );

const SelectLikeField = ({ label, isActive, children }: SelectLikeFieldProps) => (
  <div className="relative">
    <div className={cn("w-full min-h-[48px] rounded-md border border-white/20 px-3 py-3", "flex items-center justify-between gap-2 text-white/90")}>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <ChevronDown className="h-4 w-4 text-white/50" />
    </div>
    <FieldLabel label={label} isActive={isActive} />
  </div>
);

const EnvironmentField = ({ label, values }: EnvironmentFieldProps) => (
  <SelectLikeField label={label} isActive={values.length > 0}>
    <ValuesList values={values} />
  </SelectLikeField>
);

export { EnvironmentField, SelectLikeField };
export type { EnvironmentFieldProps, SelectLikeFieldProps };
