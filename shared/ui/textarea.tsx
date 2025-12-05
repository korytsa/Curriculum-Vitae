"use client";

import { cn } from "@/shared/lib";
import { getBorderColor, getLabelColor } from "./utils/form-field";
import { useAutoResizeTextArea, useTextareaActivity, getPlaceholderClassName } from "./utils/textarea";
import { forwardRef, type ChangeEvent, type FocusEvent, type MutableRefObject, type RefCallback, type TextareaHTMLAttributes } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TEXTAREA_BASE_CLASSES =
  "w-full min-h-[3rem] h-[3rem] rounded-md border bg-transparent px-3 py-3 text-[var(--color-text)] placeholder:font-medium transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:opacity-100 leading-6 overflow-hidden resize-none";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, value, defaultValue, disabled, readOnly, id, onFocus, onBlur, onChange, rows = 1, ...props }, ref) => {
    const { ref: internalRef, resize } = useAutoResizeTextArea(value, defaultValue);
    const { isInteractive, shouldHighlight, isLabelActive, updateFocusState, updateContentPresence } = useTextareaActivity({ value, defaultValue, disabled, readOnly });

    const placeholderClass = getPlaceholderClassName(label, isLabelActive);
    const labelColor = getLabelColor(error, shouldHighlight);
    const appliedLabelColor = !isInteractive && !error ? "text-[var(--color-disabled-text)]" : labelColor;
    const borderColor = getBorderColor(error, shouldHighlight, isInteractive);

    const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
      updateFocusState(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
      updateFocusState(false);
      onBlur?.(event);
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateContentPresence(event.currentTarget.value);
      resize();
      onChange?.(event);
    };

    const setRef: RefCallback<HTMLTextAreaElement> = (element) => {
      internalRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && "current" in ref) {
        (ref as MutableRefObject<HTMLTextAreaElement | null>).current = element;
      }
      if (element) {
        resize();
      }
    };

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <textarea
            id={id}
            ref={setRef}
            className={cn(
              TEXTAREA_BASE_CLASSES,
              borderColor,
              placeholderClass,
              readOnly && "pointer-events-none",
              !isInteractive && "text-[var(--color-disabled-text)]",
              className
            )}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "absolute left-3 px-1 transition-all duration-200",
                isLabelActive ? "top-0 -translate-y-1/2 text-xs bg-[var(--color-bg)]" : "top-6 -translate-y-1/2",
                appliedLabelColor
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
