"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import { Button } from "./button";
import { DropdownMenu, type DropdownMenuItem } from "./dropdown-menu";

export interface TableRowActionsProps {
  items: DropdownMenuItem[];
  ariaLabel: string;
  menuWidth?: string;
  menuClassName?: string;
  menuBgColor?: string;
  offsetY?: number;
  align?: "left" | "right" | "top";
  buttonClassName?: string;
  iconClassName?: string;
}

export function TableRowActions({
  items,
  ariaLabel,
  menuWidth = "120px",
  menuClassName = "border border-white/5 shadow-xl",
  menuBgColor = "#2F2F2F",
  offsetY = 40,
  align = "right",
  buttonClassName = "text-white/80 hover:bg-white/10",
  iconClassName = "w-5 h-5 text-white/80",
}: TableRowActionsProps) {
  return (
    <DropdownMenu items={items} align={align} menuBgColor={menuBgColor} menuClassName={menuClassName} menuWidth={menuWidth} offsetY={offsetY}>
      <Button type="button" variant="ghost" size="icon" className={buttonClassName} aria-label={ariaLabel} icon={<IoEllipsisVertical className={iconClassName} />} />
    </DropdownMenu>
  );
}
