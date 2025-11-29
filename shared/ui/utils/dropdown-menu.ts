import type { RefObject, CSSProperties } from "react";

export type DropdownAlign = "left" | "right" | "bottom" | "top";

export const getDropdownPositionClasses = (align: DropdownAlign = "right"): string => {
  if (align === "bottom") {
    return "bottom-full left-0 mb-2";
  }
  if (align === "left") {
    return "top-full left-0 mt-2";
  }
  return "top-full right-0 mt-1";
};

export const buildDropdownMenuStyles = (menuWidth?: string, menuBgColor?: string): CSSProperties | undefined => {
  if (!menuWidth && !menuBgColor) {
    return undefined;
  }

  return {
    ...(menuWidth ? { width: menuWidth } : {}),
    ...(menuBgColor ? { backgroundColor: menuBgColor } : {}),
  };
};

export const isClickOutside = (ref: RefObject<HTMLElement>, event: MouseEvent): boolean => {
  if (!ref.current) return false;
  return !ref.current.contains(event.target as Node);
};
