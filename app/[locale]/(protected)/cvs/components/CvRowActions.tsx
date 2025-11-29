"use client";

import { useTranslation } from "react-i18next";
import { IoEllipsisVertical } from "react-icons/io5";
import { Button, DropdownMenu, type DropdownMenuItem } from "@/shared/ui";
import type { CvListItem } from "@/features/cvs";

interface CvRowActionsProps {
  row: CvListItem;
  onDetails?: (cvId: string) => void;
  onDelete?: (cvId: string) => void;
}

export function CvRowActions({ row, onDetails, onDelete }: CvRowActionsProps) {
  const { t } = useTranslation();
  const labelTarget = row.name || row.id;

  const handleDetails = () => {
    onDetails?.(row.id);
  };

  const handleDelete = () => {
    onDelete?.(row.id);
  };

  const menuItems: DropdownMenuItem[] = [
    {
      label: t("cvs.actions.details", { defaultValue: "Details" }),
      onClick: handleDetails,
    },
    {
      label: t("cvs.actions.delete", { defaultValue: "Delete CV" }),
      onClick: handleDelete,
    },
  ];

  return (
    <DropdownMenu offsetY={40} align="right" menuWidth="120px" items={menuItems} menuBgColor="#2F2F2F" menuClassName="border border-white/5 shadow-xl">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white/80 hover:bg-white/10"
        aria-label={`Open actions for ${labelTarget}`}
        icon={<IoEllipsisVertical className="w-5 h-5 text-white/80" />}
      />
    </DropdownMenu>
  );
}
