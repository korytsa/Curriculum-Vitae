import * as React from "react";
import { cn } from "@/shared/lib";
import { Button } from "./button";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { getBorderColor, getLabelColor } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hidePasswordToggle?: boolean;
}

const INPUT_BASE_CLASSES =
	"w-full h-12 rounded-md border bg-transparent px-3 py-3 text-[var(--color-text)] placeholder:font-medium transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:opacity-100";

const PLACEHOLDER_DEFAULT = "placeholder:text-[var(--color-placeholder)]";
const PLACEHOLDER_ACTIVE = "placeholder:text-[var(--color-placeholder-active)]";
const PLACEHOLDER_MASKED = "placeholder:text-transparent";

const getPlaceholderClassName = (label?: string, isLabelActive?: boolean) => {
  if (!label) {
    return PLACEHOLDER_DEFAULT;
  }
  return isLabelActive ? PLACEHOLDER_ACTIVE : PLACEHOLDER_MASKED;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      placeholder,
      error,
      value,
      label,
      disabled,
      readOnly,
      hidePasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const isPassword = type === "password";
    const showPasswordToggle = isPassword && !hidePasswordToggle;
    const hasValue = Boolean(value);
    const isLabelActive = isFocused || hasValue;
    const inputType = isPassword
      ? showPassword && showPasswordToggle
        ? "text"
        : "password"
      : type;
    const isInteractive = !disabled && !readOnly;
    const isNonEditable = !isInteractive;
    const shouldHighlight = isFocused && isInteractive;
    const placeholderClass = getPlaceholderClassName(label, isLabelActive);
    const labelColor = getLabelColor(error, shouldHighlight);
    const appliedLabelColor =
      isNonEditable && !error
        ? "text-[var(--color-disabled-text)]"
        : labelColor;
    const borderColor = getBorderColor(error, shouldHighlight, isInteractive);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      if (isInteractive) {
        setIsFocused(true);
      }
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (isInteractive) {
        setIsFocused(false);
      }
      props.onBlur?.(event);
    };

    const inputElement = (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            INPUT_BASE_CLASSES,
            borderColor,
            placeholderClass,
            isPassword && "pr-10",
            readOnly && "pointer-events-none",
            isNonEditable && "text-[var(--color-disabled-text)]",
            className
          )}
          ref={ref}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none px-2",
              isLabelActive
                ? "top-0 -translate-y-1/2 text-xs bg-[var(--color-bg)]"
                : "top-1/2 -translate-y-1/2 text-sm",
              appliedLabelColor
            )}
          >
            {label}
          </label>
        )}
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--color-text)] hover:opacity-70 z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
            icon={
              showPassword ? (
                <IoEyeOffSharp size={20} />
              ) : (
                <IoEyeSharp size={20} />
              )
            }
          />
        )}
      </div>
    );

    return (
      <div className="space-y-1.5">
        {inputElement}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
