"use client";

import type { ReactNode, ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { buildDropdownMenuStyles, isClickOutside, type DropdownAlign } from "./utils/dropdown-menu";

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

export type DropdownMenuItem = DropdownMenuSeparatorItem | DropdownMenuActionItem;

interface DropdownMenuProps {
  children: ReactNode;
  items: DropdownMenuItem[];
  align?: DropdownAlign;
  className?: string;
  menuClassName?: string;
  menuWidth?: string;
  menuBgColor?: string;
  offsetX?: number;
  offsetY?: number;
}

const isSeparatorItem = (item: DropdownMenuItem): item is DropdownMenuSeparatorItem => item.type === "separator";

export function DropdownMenu({ children, items, align = "right", className, menuClassName, menuWidth, menuBgColor, offsetX = 0, offsetY = 0 }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (!isOpen || !isMounted) return;

    const updateMenuPosition = () => {
      if (!triggerRef.current || !menuRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menu = menuRef.current;

      if (align === "right") {
        menu.style.left = `${triggerRect.right + offsetX}px`;
        menu.style.top = `${triggerRect.top + offsetY}px`;
        menu.style.transform = "translateX(-100%)";
      } else if (align === "top") {
        menu.style.left = `${triggerRect.left + offsetX}px`;
        menu.style.bottom = `${window.innerHeight - triggerRect.top - offsetY}px`;
        menu.style.transform = "none";
      } else {
        menu.style.left = `${triggerRect.left + offsetX}px`;
        menu.style.top = `${triggerRect.bottom + offsetY}px`;
      }
    };

    updateMenuPosition();

    const handleClickOutside = (event: MouseEvent) => {
      if (isClickOutside(menuRef, event) && isClickOutside(triggerRef, event)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      updateMenuPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMounted, align, offsetX, offsetY]);

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
      <button type="button" onClick={toggleMenu} aria-haspopup="menu" aria-expanded={isOpen} className="inline-flex items-center justify-center">
        {children}
      </button>
    );
  };

  const menuStyles = buildDropdownMenuStyles(menuWidth, menuBgColor);

  if (!isMounted) {
    return (
      <div ref={triggerRef} className={cn("relative inline-flex", className)} data-state="closed">
        {renderTrigger()}
      </div>
    );
  }

  const menuContent = isOpen && (
    <div ref={menuRef} className={cn("fixed z-[9999] w-[150px] border rounded-[8px] bg-[#2F2F2F] overflow-hidden shadow-lg", menuClassName)} style={menuStyles}>
      <div className="py-2">
        {items.map((item, index) => {
          if (isSeparatorItem(item)) {
            const key = item.id ?? index;
            return <div key={`separator-${key}`} className="border-t border-white/15 my-1" />;
          }

          const content = (
            <div
              onClick={() => handleItemClick(item)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 transition-colors",
                item.disabled ? "text-gray-400 cursor-not-allowed" : "text-white hover:bg-white/10 cursor-pointer"
              )}
            >
              {item.icon && <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={`${item.label}-${index}`} href={item.href} className="block no-underline" onClick={closeMenu}>
                {content}
              </Link>
            );
          }

          return <div key={`${item.label}-${index}`}>{content}</div>;
        })}
      </div>
    </div>
  );

  return (
    <>
      <div ref={triggerRef} className={cn("relative inline-flex", className)} data-state={isOpen ? "open" : "closed"}>
        {renderTrigger()}
      </div>
      {isMounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}
