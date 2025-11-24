import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useId,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import {
  findSelectedOption,
  isNoSelectionValue,
  isNoOptionLabel,
  getDisplayValue,
  hasValue as checkHasValue,
  isLabelActive,
  isActive,
  getLabelColor,
  getBorderColor,
  type SelectOption,
} from "./utils";

export type { SelectOption };

type SelectAlign = "center" | "bottom";

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  align?: SelectAlign;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      error,
      label,
      disabled,
      readOnly,
      align = "center",
      ...props
    },
    ref
  ) => {
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
    const labelColor = getLabelColor(
      error,
      isInteractive ? isActiveState : false
    );
    const borderColor = getBorderColor(
      error,
      isInteractive ? isActiveState : false,
      isInteractive
    );

    useEffect(() => {
      if (!isOpen) return;

      const closeDropdown = () => {
        setIsOpen(false);
        setIsFocused(false);
      };

      const handleDocumentMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          selectRef.current?.contains(target) ||
          dropdownRef.current?.contains(target)
        ) {
          return;
        }
        closeDropdown();
      };

      const handleDocumentKeyDown = (event: KeyboardEvent) => {
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
      <div
        className={cn("relative select-none", className)}
        ref={ref}
        {...props}
      >
        <div className="relative" ref={selectRef}>
          <div
            className={cn(
              "w-full h-12 rounded-md border bg-transparent px-3 py-3 text-[#C7C7C7] transition-all cursor-pointer",
              "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "flex items-center justify-between",
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
            <span className={cn("flex-1 text-left text-[#C7C7C7]")}>
              {displayValue}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-white transition-transform duration-200 flex-shrink-0",
                isOpen && "transform rotate-180"
              )}
            />
          </div>

          {label && (
            <label
              className={cn(
                "absolute left-3 transition-all duration-200 pointer-events-none px-2 z-10",
                isLabelActiveState
                  ? "top-0 -translate-y-1/2 text-xs bg-[#353535]"
                  : "top-1/2 -translate-y-1/2 text-sm",
                labelColor
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
              const spaceBelow = selectRect
                ? viewportHeight - selectRect.bottom - viewportPadding
                : 0;
              const dropdownOffset = 4;
              const itemHeight = 40;
              const groupHeaderHeight = 32;
              const estimatedContentHeight = options.reduce(
                (total, option) =>
                  total +
                  (option.isGroupHeader ? groupHeaderHeight : itemHeight),
                0
              );
              const safeViewportHeight = Math.max(
                viewportHeight - viewportPadding * 2,
                itemHeight
              );
              const maxHeight = Math.min(
                500,
                safeViewportHeight,
                Math.max(spaceBelow, estimatedContentHeight)
              );
              const baseDropdownHeight = Math.min(
                estimatedContentHeight,
                maxHeight
              );
              const dropdownHeight =
                align === "bottom"
                  ? Math.min(baseDropdownHeight, 320)
                  : baseDropdownHeight;
              const selectCenter = selectRect
                ? selectRect.top + selectRect.height / 2
                : viewportPadding;
              const maxTop = viewportHeight - dropdownHeight - viewportPadding;
              const centeredTop = selectCenter - dropdownHeight / 2;
              const clampTop = (desiredTop: number) =>
                Math.min(
                  Math.max(desiredTop, viewportPadding),
                  Math.max(maxTop, viewportPadding)
                );
              const topPosition =
                align === "bottom"
                  ? clampTop(
                      (selectRect ? selectRect.bottom : viewportPadding) +
                        dropdownOffset
                    )
                  : clampTop(centeredTop);

              const dropdownContent = (
                <div
                  ref={dropdownRef}
                  id={listboxId}
                  className="fixed top-20 z-[10000] bg-[#2F2F2F] shadow-lg overflow-auto [&::-webkit-scrollbar]:hidden"
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
                          className="px-3 py-2 text-red-500 text-xs font-semibold uppercase tracking-wider bg-[#3a3a3a]"
                          role="group"
                          aria-label={option.label}
                        >
                          {option.label}
                        </div>
                      );
                    }

                    const isPlaceholderOption = isNoOptionLabel(option.label);
                    const isSelected =
                      option.value === value ||
                      (!value && isNoSelection && isPlaceholderOption);

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "px-3 py-2 cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#652727] text-white"
                            : "text-[#C7C7C7] hover:bg-[#3e3e3e] hover:text-white"
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
