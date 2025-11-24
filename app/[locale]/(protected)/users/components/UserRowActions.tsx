"use client";

import { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { IoEllipsisVertical } from "react-icons/io5";
import { DropdownMenu, type DropdownMenuItem } from "@/shared/ui";
import type { User } from "../types";
import UpdateUserModal from "./UpdateUserModal";

interface UserRowActionsProps {
  row: User;
  onNavigate: (userId: string) => void;
  currentUserId?: string | null;
}

export function UserRowActions({
  row,
  onNavigate,
  currentUserId,
}: UserRowActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const labelTarget = row.profile.first_name || row.email;
  const isCurrentUser = Boolean(currentUserId && row.id === currentUserId);

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

  if (isCurrentUser) {
    const menuItems: DropdownMenuItem[] = [
      {
        label: "Profile",
        onClick: navigateToUser,
      },
      {
        label: "Update user",
        onClick: handleOpenModal,
      },
      {
        label: "Delete user",
        disabled: true,
      },
    ];

    return (
      <>
        <DropdownMenu
          items={menuItems}
          align="right"
          menuBgColor="#2F2F2F"
          menuClassName="border border-white/5 shadow-xl"
          menuWidth="140px"
        >
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
            aria-label={`Open actions for ${labelTarget}`}
          >
            <IoEllipsisVertical className="w-5 h-5 text-white/80" />
          </button>
        </DropdownMenu>
        <UpdateUserModal
          user={row}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
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
