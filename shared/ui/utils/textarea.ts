"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TextareaHTMLAttributes } from "react";

type TextAreaValue = TextareaHTMLAttributes<HTMLTextAreaElement>["value"];
type TextAreaDefaultValue =
  TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"];

export type UseTextareaActivityParams = {
  value?: TextAreaValue;
  defaultValue?: TextAreaDefaultValue;
  disabled?: boolean;
  readOnly?: boolean;
};

export type UseTextareaActivityResult = {
  isInteractive: boolean;
  shouldHighlight: boolean;
  isLabelActive: boolean;
  updateFocusState: (nextFocused: boolean) => void;
  updateContentPresence: (content: string) => void;
};

export type UseAutoResizeResult = {
  ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  resize: () => void;
};

const PLACEHOLDER_DEFAULT = "placeholder:text-[var(--color-placeholder)]";
const PLACEHOLDER_ACTIVE =
  "placeholder:text-[var(--color-placeholder-active)]";
const PLACEHOLDER_MASKED = "placeholder:text-transparent";

export const getPlaceholderClassName = (label?: string, active?: boolean) => {
  if (!label) {
    return PLACEHOLDER_DEFAULT;
  }
  return active ? PLACEHOLDER_ACTIVE : PLACEHOLDER_MASKED;
};

const hasTextContent = (input?: unknown) => String(input ?? "").length > 0;

const getInitialContentPresence = (
  value?: TextAreaValue,
  defaultValue?: TextAreaDefaultValue
) => {
  if (value != null) {
    return hasTextContent(value);
  }
  if (defaultValue != null) {
    return hasTextContent(defaultValue);
  }
  return false;
};

const adjustTextAreaHeight = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

export const useAutoResizeTextArea = (
  value?: TextAreaValue,
  defaultValue?: TextAreaDefaultValue
): UseAutoResizeResult => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    adjustTextAreaHeight(ref.current);
  }, [value, defaultValue]);

  const resize = () => {
    adjustTextAreaHeight(ref.current);
  };

  return { ref, resize };
};

export const useTextareaActivity = ({
  value,
  defaultValue,
  disabled,
  readOnly,
}: UseTextareaActivityParams): UseTextareaActivityResult => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(() =>
    getInitialContentPresence(value, defaultValue)
  );

  useEffect(() => {
    if (value !== undefined) {
      setHasContent(hasTextContent(value));
    }
  }, [value]);

  const isInteractive = !(disabled || readOnly);
  const shouldHighlight = isFocused && isInteractive;
  const isLabelActive = isFocused || hasContent;

  const updateFocusState = (nextFocused: boolean) => {
    if (isInteractive) {
      setIsFocused(nextFocused);
    }
  };

  const updateContentPresence = (content: string) => {
    setHasContent(content.length > 0);
  };

  return {
    isInteractive,
    shouldHighlight,
    isLabelActive,
    updateFocusState,
    updateContentPresence,
  };
};


