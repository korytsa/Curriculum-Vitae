import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { useEffect, useState, useRef, forwardRef, useId, type HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { findSelectedOption, isNoSelectionValue, isNoOptionLabel, getDisplayValue, hasValue as checkHasValue, isLabelActive, isActive, type SelectOption } from "./utils/select";
import { getLabelColor, getBorderColor } from "./utils/form-field";

export type { SelectOption };

type SelectAlign = "center" | "bottom";

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  align?: SelectAlign;
  placeholder?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, value, onChange, error, label, disabled, readOnly, align = "center", placeholder, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();
    const selectedOption = findSelectedOption(options, value);
    const isNoSelection = isNoSelectionValue(value, selectedOption);
    const displayValue = getDisplayValue(selectedOption, isNoSelection);
    const hasValue = checkHasValue(value, selectedOption, isNoSelection);
    const isLabelActiveState = isLabelActive(isFocused, hasValue, isOpen);
    const isActiveState = isActive(isFocused, isOpen);

    const isInteractive = !(disabled || readOnly);
    const isNonEditable = !isInteractive;
    const labelColor = getLabelColor(error, isInteractive ? isActiveState : false);
    const appliedLabelColor = isNonEditable && !error ? "text-[var(--color-disabled-text)]" : labelColor;
    const borderColor = getBorderColor(error, isInteractive ? isActiveState : false, isInteractive);

    useEffect(() => {
      if (!isOpen) return;

      const closeDropdown = () => {
        setIsOpen(false);
        setIsFocused(false);
      };

      const handleDocumentMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (selectRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
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

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    };

    const handleToggle = () => {
      if (disabled || readOnly) return;
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      setIsFocused(newIsOpen);
    };

    return (
      <div className={cn("relative select-none", className)} ref={ref} {...props}>
        <div className="relative" ref={selectRef}>
          <div
            className={cn(
              "w-full min-h-[48px] rounded-md border px-3 py-3 transition-all cursor-pointer bg-transparent",
              "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "flex items-center gap-2",
              borderColor,
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleToggle}
            onFocus={() => {
              if (isInteractive) {
                setIsFocused(true);
              }
            }}
            onBlur={() => {
              if (!isOpen && isInteractive) {
                setIsFocused(false);
              }
            }}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-disabled={disabled}
            aria-readonly={readOnly || undefined}
          >
            <span className={cn("flex-1 text-left text-[var(--color-text)]", isNonEditable && "text-[var(--color-disabled-text)]")}>{displayValue || placeholder}</span>
            <ChevronDown className={cn("h-4 w-4 text-white transition-transform duration-200 flex-shrink-0", isOpen && "transform rotate-180")} />
          </div>

          {label && (
            <label
              className={cn(
                "absolute left-3 transition-all duration-200 pointer-events-none px-1 z-10",
                isLabelActiveState ? "top-0 -translate-y-1/2 text-xs bg-[var(--color-bg)]" : "top-1/2 -translate-y-1/2",
                appliedLabelColor
              )}
            >
              {label}
            </label>
          )}

          {isOpen &&
            (() => {
              const selectRect = selectRef.current?.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const viewportPadding = 8;
              const estimatedContentHeight = options.reduce((total, option) => total + (option.isGroupHeader ? 32 : 40), 0);
              const spaceBelow = selectRect ? viewportHeight - selectRect.bottom - viewportPadding : 0;
              const maxHeight = Math.min(500, Math.max(viewportHeight - viewportPadding * 2, 40), Math.max(spaceBelow, estimatedContentHeight));
              const dropdownHeight = align === "bottom" ? Math.min(estimatedContentHeight, maxHeight, 320) : Math.min(estimatedContentHeight, maxHeight);
              const maxTop = viewportHeight - dropdownHeight - viewportPadding;
              const clampTop = (desiredTop: number) => Math.min(Math.max(desiredTop, viewportPadding), Math.max(maxTop, viewportPadding));

              const topPosition =
                align === "bottom"
                  ? clampTop((selectRect?.bottom ?? viewportPadding) + 4)
                  : clampTop((selectRect ? selectRect.top + selectRect.height / 2 : viewportPadding) - dropdownHeight / 2);

              const dropdownContent = (
                <div
                  ref={dropdownRef}
                  id={listboxId}
                  className="fixed top-20 z-[10000] bg-[var(--color-select-dropdown-bg)] shadow-lg overflow-auto [&::-webkit-scrollbar]:hidden"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    top: topPosition,
                    left: selectRect ? selectRect.left : 0,
                    width: selectRect ? selectRect.width : "auto",
                    maxHeight: `${maxHeight}px`,
                    height: `${dropdownHeight}px`,
                  }}
                  role="listbox"
                >
                  {options.map((option) => {
                    if (option.isGroupHeader) {
                      return (
                        <div
                          key={option.value}
                          className="px-3 py-2 text-red-500 text-xs font-semibold uppercase tracking-wider bg-[var(--color-option-group-bg)]"
                          role="group"
                          aria-label={option.label}
                        >
                          {option.label}
                        </div>
                      );
                    }

                    const isPlaceholderOption = isNoOptionLabel(option.label);
                    const isSelected = option.value === value || (!value && isNoSelection && isPlaceholderOption);

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "px-3 py-2 cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[var(--color-option-selected-bg)] text-[var(--color-accent-text)]"
                            : "text-[var(--color-text-subtle)] hover:bg-[var(--color-option-hover-bg)] hover:text-[var(--color-text)]"
                        )}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>
              );

              return createPortal(dropdownContent, document.body);
            })()}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
