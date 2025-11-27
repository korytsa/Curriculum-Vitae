"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdChevronRight } from "react-icons/md";
import { IoEllipsisVertical } from "react-icons/io5";
import toast from "react-hot-toast";
import { DropdownMenu, type DropdownMenuItem } from "@/shared/ui";
import { withErrorToast } from "@/shared/lib";
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

export function UserRowActions({
  row,
  onNavigate,
  currentUserId,
  isAdmin = false,
  onDeleted,
}: UserRowActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { t } = useTranslation();
  const labelTarget = row.profile.first_name || row.email;
  const isCurrentUser = Boolean(currentUserId && row.id === currentUserId);
  const canDeleteUser = isAdmin && !isCurrentUser;

  const navigateToUser = () => {
    onNavigate(row.id);
  };

  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigateToUser();
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
    await withErrorToast(
      async () => {
        await onDeleted?.();
      },
      {
        messageKey: "users.deleteModal.notifications.refreshError",
        defaultMessage: "Deletion completed, but something went wrong",
      }
    );

    toast.success(
      t("users.deleteModal.toast", { defaultValue: "User deleted" })
    );
  };

  if (isCurrentUser || isAdmin) {
    const menuItems: DropdownMenuItem[] = [
      {
        label: t("users.actions.profile", { defaultValue: "Profile" }),
        onClick: navigateToUser,
      },
      {
        label: t("users.actions.update", { defaultValue: "Update user" }),
        onClick: handleOpenModal,
      },
    ];

    if (isAdmin) {
      menuItems.push({ type: "separator" });
      menuItems.push({
        label: t("users.actions.delete", { defaultValue: "Delete user" }),
        onClick: handleOpenDeleteModal,
        disabled: !canDeleteUser,
      });
    }

    return (
      <>
        <DropdownMenu
          items={menuItems}
          align="right"
          menuBgColor="#2F2F2F"
          menuClassName="border border-white/5 shadow-xl"
          menuWidth="160px"
        >
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
            aria-label={t("users.actions.openMenu", {
              defaultValue: "Open actions",
            })}
          >
            <IoEllipsisVertical className="w-5 h-5 text-white/80" />
          </button>
        </DropdownMenu>
        <UpdateUserModal
          user={row}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
        {isAdmin ? (
          <DeleteUserModal
            user={row}
            open={isDeleteModalOpen && canDeleteUser}
            onClose={handleCloseDeleteModal}
            onDeleted={handleDeleted}
          />
        ) : null}
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
      aria-label={`Navigate to ${labelTarget} profile`}
    >
      <MdChevronRight className="w-5 h-5 text-white/80" />
    </button>
  );
}
