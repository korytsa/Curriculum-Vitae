import * as React from "react";
import { cn } from "@/shared/lib";
import { Button } from "./button";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { getBorderColor, getLabelColor } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const INPUT_BASE_CLASSES =
  "w-full h-12 rounded-md border bg-transparent px-3 py-3 text-[#C7C7C7] placeholder:font-medium transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:opacity-100";

const PLACEHOLDER_DEFAULT = "placeholder:text-[#c4c4c4]";
const PLACEHOLDER_ACTIVE = "placeholder:text-[#bdbdbd]";
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
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const isPassword = type === "password";
    const hasValue = Boolean(value);
    const isLabelActive = isFocused || hasValue;
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const isInteractive = !disabled && !readOnly;
    const shouldHighlight = isFocused && isInteractive;
    const placeholderClass = getPlaceholderClassName(label, isLabelActive);
    const labelColor = getLabelColor(error, shouldHighlight);
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
                ? "top-0 -translate-y-1/2 text-xs bg-[#353535]"
                : "top-1/2 -translate-y-1/2 text-sm",
              labelColor
            )}
          >
            {label}
          </label>
        )}
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-10"
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
