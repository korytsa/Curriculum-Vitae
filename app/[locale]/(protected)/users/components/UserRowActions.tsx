"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdChevronRight } from "react-icons/md";
import toast from "react-hot-toast";
import { Button, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import type { User } from "../types";
import UpdateUserModal from "./UpdateUserModal";
import DeleteUserModal from "./DeleteUserModal";

interface UserRowActionsProps {
  row: User;
  onNavigate: (userId: string) => void;
  currentUserId?: string | null;
  isAdmin?: boolean;
  onDeleted?: () => Promise<void> | void;
}

export function UserRowActions({ row, onNavigate, currentUserId, isAdmin = false, onDeleted }: UserRowActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { t } = useTranslation();
  const isCurrentUser = Boolean(currentUserId && row.id === currentUserId);

  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onNavigate(row.id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleted = async () => {
    await onDeleted?.();
    toast.success(t("users.deleteModal.toast"));
  };

  if (isCurrentUser || isAdmin) {
    const menuItems: DropdownMenuItem[] = [
      {
        label: t("users.actions.profile"),
        onClick: () => onNavigate(row.id),
      },
      {
        label: t("users.actions.update"),
        onClick: handleOpenModal,
      },
    ];

    menuItems.push({
      label: t("users.actions.delete"),
      onClick: isAdmin ? handleOpenDeleteModal : undefined,
      disabled: !isAdmin,
    });

    return (
      <>
        <TableRowActions items={menuItems} ariaLabel={t("users.actions.openMenu")} menuWidth="130px" />
        <UpdateUserModal user={row} open={isModalOpen} onClose={handleCloseModal} />
        {isAdmin ? <DeleteUserModal user={row} open={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDeleted={handleDeleted} /> : null}
      </>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleNavigate}
      size="icon"
      className="text-white/80 hover:bg-white/10"
      aria-label={t("users.actions.openMenu")}
      icon={<MdChevronRight className="w-5 h-5 text-white/80" />}
    />
  );
}
