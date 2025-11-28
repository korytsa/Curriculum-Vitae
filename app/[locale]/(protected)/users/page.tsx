"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Table, SearchInput, Button, Modal } from "@/shared/ui";
import { CreateUserForm } from "@/features/create-user-form";
import { useUsersPage } from "./lib/useUsersPage";

export default function UsersPage() {
  const {
    heading,
    searchInputProps,
    tableProps,
    canCreateUser,
    createUserLabel,
    refreshUsers,
  } = useUsersPage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCreateSuccess = async (message: string) => {
    toast.success(message);
    handleCloseCreateModal();
    try {
      await refreshUsers();
    } catch (error) {
      console.error("Failed to refresh users after creation:", error);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>
          <div className="w-full sm:w-[325px]">
            <SearchInput {...searchInputProps} />
          </div>
        </div>
        {canCreateUser ? (
          <div className="pr-10 pt-3">
            <Button
              variant="dangerGhost"
              size="sm"
              className="mt-1"
              onClick={handleOpenCreateModal}
            >
              <span className="text-xl leading-none">+</span>
              {createUserLabel}
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-4">
        <Table {...tableProps} />
      </div>
      {canCreateUser ? (
        <Modal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          title={createUserLabel}
          className="max-w-3xl"
        >
          <CreateUserForm showHeading={false} onSuccess={handleCreateSuccess} />
        </Modal>
      ) : null}
    </section>
  );
}
