"use client";

import { useTranslation } from "react-i18next";
import { IoEllipsisVertical } from "react-icons/io5";
import { DropdownMenu, type DropdownMenuItem, Button } from "@/shared/ui";
import type { CvProject } from "@/shared/graphql/generated";
import { buildProjectRowActionsLabels } from "../config/constants";

interface ProjectRowActionsProps {
  row: CvProject;
  onUpdate?: (project: CvProject) => void;
  onDeleteRequest?: (project: CvProject) => void;
}

export function ProjectRowActions({ row, onUpdate, onDeleteRequest }: ProjectRowActionsProps) {
  const { t } = useTranslation();
  const translate = (key: string, defaultValue: string) => t(key, { defaultValue }) || defaultValue;
  const labels = buildProjectRowActionsLabels(translate);

  const handleUpdate = () => {
    onUpdate?.(row);
  };

  const handleRemove = () => {
    onDeleteRequest?.(row);
  };

  const menuItems: DropdownMenuItem[] = [
    {
      label: labels.update,
      onClick: handleUpdate,
    },
    {
      label: labels.remove,
      onClick: handleRemove,
    },
  ];

  return (
    <DropdownMenu items={menuItems} align="right" menuBgColor="#2F2F2F" menuClassName="border border-white/5 shadow-xl" menuWidth="155px" offsetY={40}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        aria-label={labels.openMenu}
        icon={<IoEllipsisVertical className="w-5 h-5 text-white" />}
      />
    </DropdownMenu>
  );
}
