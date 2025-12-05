import type { ReactNode } from "react";
import { useState, useRef, useEffect, useId, useMemo } from "react";
import { createPortal } from "react-dom";

import { ChevronDown } from "lucide-react";
import { IoCloseCircle } from "react-icons/io5";
import { cn } from "@/shared/lib";
import { getLabelColor, getBorderColor } from "./utils/form-field";

type SelectLikeFieldProps = {
  label: string;
  isActive: boolean;
  children: ReactNode;
};

type EnvironmentFieldProps = {
  label: string;
  values: string[];
};

type MultiSelectEnvironmentFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  options?: string[];
};

type ValuePillProps = {
  value: string;
  onRemove?: () => void;
};

const FIELD_MIN_HEIGHT = 48;
const DROPDOWN_OPTION_HEIGHT = 40;
const DROPDOWN_MAX_HEIGHT = 300;
const DROPDOWN_PADDING = 8;
const DROPDOWN_GAP = 4;

const FieldLabel = ({ label, isActive, labelColor }: { label: string; isActive: boolean; labelColor?: string }) => (
  <label
    className={cn(
      "absolute left-3 px-2 transition-all duration-200 bg-[var(--color-bg)]",
      isActive ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2",
      labelColor || "text-[var(--color-disabled-text)]"
    )}
  >
    {label}
  </label>
);

const ValuePill = ({ value, onRemove }: ValuePillProps) => (
  <span className="flex items-center gap-1 rounded-full bg-[#424242] border border-white/20 px-2 py-1 text-xs text-white/90">
    {value}
    {onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="hover:text-white transition-colors"
        aria-label={`Remove ${value}`}
      >
        <IoCloseCircle className="size-4 text-white/50 hover:text-white" />
      </button>
    )}
  </span>
);

const ValuesList = ({ values }: { values: string[] }) => {
  if (!values.length) {
    return <span className="select-none text-transparent">.</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {values.map((value) => (
        <ValuePill key={value} value={value} />
      ))}
    </div>
  );
};

const SelectLikeField = ({ label, isActive, children }: SelectLikeFieldProps) => (
  <div className="relative">
    <div className="w-full min-h-[48px] rounded-md border border-white/20 px-3 py-3 flex items-center justify-between gap-2 text-white/90">
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

type DropdownOptionProps = {
  option: string;
  onSelect: (option: string) => void;
};

const DropdownOption = ({ option, onSelect }: DropdownOptionProps) => (
  <div
    className="px-3 py-2 cursor-pointer transition-colors text-[var(--color-text-subtle)] hover:bg-[var(--color-option-hover-bg)] hover:text-[var(--color-text)] text-sm"
    onClick={() => onSelect(option)}
    role="option"
    aria-selected="false"
  >
    {option}
  </div>
);

type DropdownProps = {
  options: string[];
  inputValue: string;
  fieldRect: DOMRect | null;
  onSelect: (option: string) => void;
  listboxId: string;
  dropdownRef: React.RefObject<HTMLDivElement>;
};

const Dropdown = ({ options, inputValue, fieldRect, onSelect, listboxId, dropdownRef }: DropdownProps) => {
  const dropdownPosition = useMemo(() => {
    if (!fieldRect) {
      return { top: DROPDOWN_PADDING, left: 0, width: "auto", maxHeight: DROPDOWN_MAX_HEIGHT };
    }

    const viewportHeight = window.innerHeight;
    const estimatedContentHeight = Math.min(DROPDOWN_MAX_HEIGHT, (options.length || 1) * DROPDOWN_OPTION_HEIGHT + DROPDOWN_GAP);
    const spaceBelow = viewportHeight - fieldRect.bottom - DROPDOWN_PADDING;
    const maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, Math.max(viewportHeight - DROPDOWN_PADDING * 2, DROPDOWN_OPTION_HEIGHT), Math.max(spaceBelow, estimatedContentHeight));

    return {
      top: fieldRect.bottom + DROPDOWN_GAP,
      left: fieldRect.left,
      width: fieldRect.width,
      maxHeight,
    };
  }, [fieldRect, options.length]);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      id={listboxId}
      className="fixed z-[10000] bg-[var(--color-select-dropdown-bg)] shadow-lg overflow-auto rounded-md [&::-webkit-scrollbar]:hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...dropdownPosition,
        maxHeight: `${dropdownPosition.maxHeight}px`,
      }}
      role="listbox"
      onClick={(e) => e.stopPropagation()}
    >
      {options.length > 0 ? (
        options.map((option) => <DropdownOption key={option} option={option} onSelect={onSelect} />)
      ) : (
        <div className="px-3 py-2 text-[var(--color-text-subtle)] text-sm">{inputValue ? "No results" : "No options"}</div>
      )}
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

const MultiSelectEnvironmentField = ({ label, values, onChange, placeholder = "Add skill", options = [] }: MultiSelectEnvironmentFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fieldRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const hasValue = values.length > 0;
  const isLabelActive = isFocused || hasValue || isOpen;
  const isActive = isFocused || isOpen;
  const labelColor = getLabelColor(undefined, isActive);
  const borderColor = getBorderColor(undefined, isActive, true);

  const filteredOptions = useMemo(
    () => options.filter((option) => !values.includes(option) && option.toLowerCase().includes(inputValue.toLowerCase())),
    [options, values, inputValue]
  );

  useEffect(() => {
    if (!isOpen) return;

    const closeDropdown = () => {
      setIsOpen(false);
      setIsFocused(false);
      setInputValue("");
    };

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (fieldRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }
      closeDropdown();
    };

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove));
  };

  const handleAdd = (valueToAdd: string) => {
    const trimmedValue = valueToAdd.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
    }
    setInputValue("");
  };

  const handleSelectOption = (option: string) => {
    handleAdd(option);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAdd(inputValue);
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      handleRemove(values[values.length - 1]);
    }
  };

  const fieldRect = fieldRef.current?.getBoundingClientRect() || null;

  return (
    <div className="relative select-none" ref={fieldRef}>
      <div className="relative">
        <div
          className={cn(
            "w-full min-h-[48px] rounded-md border px-3 py-3 transition-all cursor-pointer bg-transparent",
            "focus-visible:outline-none flex items-center gap-2",
            borderColor
          )}
          onClick={handleToggle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!isOpen) {
              setIsFocused(false);
            }
          }}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
        >
          <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
            {values.map((value) => (
              <ValuePill key={value} value={value} onRemove={() => handleRemove(value)} />
            ))}
            {isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-white/90 placeholder:text-white/30 text-sm"
                placeholder={placeholder}
                autoComplete="off"
              />
            ) : (
              !hasValue && <span className="text-white/30 text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 text-white/50 transition-transform duration-200 flex-shrink-0", isOpen && "transform rotate-180")} />
        </div>

        <FieldLabel label={label} isActive={isLabelActive} labelColor={labelColor} />

        {isOpen && (
          <Dropdown options={filteredOptions} inputValue={inputValue} fieldRect={fieldRect} onSelect={handleSelectOption} listboxId={listboxId} dropdownRef={dropdownRef} />
        )}
      </div>
    </div>
  );
};

export { EnvironmentField, SelectLikeField, MultiSelectEnvironmentField };
export type { EnvironmentFieldProps, SelectLikeFieldProps, MultiSelectEnvironmentFieldProps };
