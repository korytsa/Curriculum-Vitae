"use client";

import { Trans, useTranslation } from "react-i18next";
import { ConfirmDeleteModal } from "@/shared/ui";
import { useDeleteUser } from "@/features/users";
import type { User } from "../types";

interface DeleteUserModalProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onDeleted?: () => Promise<void> | void;
}

export default function DeleteUserModal({ open, user, onClose, onDeleted }: DeleteUserModalProps) {
  const { t } = useTranslation();
  const { deleteUser, loading, error } = useDeleteUser();

  const handleDelete = async () => {
    await deleteUser(user.id);
    await onDeleted?.();
    onClose();
  };

  const fullName = `${user.profile.first_name ?? ""} ${user.profile.last_name ?? ""}`.trim().replace(/\s+/g, " ");

  const displayName = fullName || user.email;

  return (
    <ConfirmDeleteModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={loading}
      errorMessage={error?.message ?? null}
      title={t("users.deleteModal.title")}
    >
      <p className="font-normal">
        <Trans
          i18nKey="users.deleteModal.warning"
          values={{ name: displayName }}
          components={{ strong: <span className="font-semibold" /> }}
        />
      </p>
    </ConfirmDeleteModal>
  );
}
