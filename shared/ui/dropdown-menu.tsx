"use client";

import type {
  ReactNode,
  ReactElement,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import {
  buildDropdownMenuStyles,
  getDropdownPositionClasses,
  isClickOutside,
  type DropdownAlign,
} from "./utils";

type DropdownMenuSeparatorItem = {
  type: "separator";
  id?: string | number;
};

type DropdownMenuActionItem = {
  type?: "action";
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
};

export type DropdownMenuItem =
  | DropdownMenuSeparatorItem
  | DropdownMenuActionItem;

interface DropdownMenuProps {
  children: ReactNode;
  items: DropdownMenuItem[];
  align?: DropdownAlign;
  className?: string;
  menuClassName?: string;
  menuWidth?: string;
  menuBgColor?: string;
}

const isSeparatorItem = (
  item: DropdownMenuItem
): item is DropdownMenuSeparatorItem => item.type === "separator";

export function DropdownMenu({
  children,
  items,
  align = "right",
  className,
  menuClassName,
  menuWidth,
  menuBgColor,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsOpen(false);

  const toggleMenu = (event: ReactMouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item: DropdownMenuActionItem) => {
    if (item.disabled) return;
    item.onClick?.();
    if (!item.href) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isClickOutside(menuRef, event)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const renderTrigger = () => {
    if (isValidElement(children)) {
      const childElement = children as ReactElement<{
        onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
        "aria-haspopup"?: string;
        "aria-expanded"?: boolean;
      }>;

      return cloneElement(childElement, {
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          childElement.props.onClick?.(event);
          toggleMenu(event);
        },
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
      });
    }

    return (
      <button
        type="button"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center"
      >
        {children}
      </button>
    );
  };

  const positionClasses = getDropdownPositionClasses(align);
  const menuStyles = buildDropdownMenuStyles(menuWidth, menuBgColor);

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-flex", className)}
      data-state={isOpen ? "open" : "closed"}
    >
      {renderTrigger()}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[150px] border rounded-[8px] bg-[#2F2F2F] overflow-hidden shadow-lg",
            positionClasses,
            menuClassName
          )}
          style={menuStyles}
        >
          <div className="py-2">
            {items.map((item, index) => {
              if (isSeparatorItem(item)) {
                const key = item.id ?? index;
                return (
                  <div
                    key={`separator-${key}`}
                    className="border-t border-white/15 my-1"
                  />
                );
              }

              const content = (
                <div
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 transition-colors",
                    item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-white hover:bg-white/10 cursor-pointer"
                  )}
                >
                  {item.icon && (
                    <span className="w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className="block no-underline"
                    onClick={closeMenu}
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={`${item.label}-${index}`}>{content}</div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
