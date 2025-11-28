"use client";

import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Modal, FormStatus } from "@/shared/ui";
import { useDeleteUser } from "@/features/users";
import type { User } from "../types";

interface DeleteUserModalProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onDeleted?: () => Promise<void> | void;
}

export default function DeleteUserModal({
  open,
  user,
  onClose,
  onDeleted,
}: DeleteUserModalProps) {
  const { t } = useTranslation();
  const { deleteUser, loading, error } = useDeleteUser();

  const handleDelete = async () => {
    await deleteUser(user.id, {
      errorHandler: (message) => {
        onClose();
        setTimeout(() => {
          toast.error(
            t("users.deleteModal.notifications.error", {
              defaultValue: "Failed to delete user. Please try again.",
            })
          );
        }, 100);
      },
    });
    await onDeleted?.();
    onClose();
    setTimeout(() => {
      toast.success(
        t("users.deleteModal.toast", { defaultValue: "User deleted" })
      );
    }, 100);
  };

  const fullName = `${user.profile.first_name ?? ""} ${
    user.profile.last_name ?? ""
  }`.trim();

  const displayName = fullName || user.email;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("users.deleteModal.title", { defaultValue: "Delete user" })}
      primaryAction={{
        label: t("users.deleteModal.actions.delete", {
          defaultValue: "DELETE",
        }),
        onClick: handleDelete,
        disabled: loading,
        variant: "danger",
      }}
      secondaryAction={{
        label: t("users.deleteModal.actions.cancel", {
          defaultValue: "CANCEL",
        }),
        onClick: onClose,
        disabled: loading,
      }}
    >
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />
      <div className="space-y-3">
        <p className="text-white/80">
          {t("users.deleteModal.warning", {
            defaultValue:
              "Are you sure you want to delete this user? This action cannot be undone.",
          })}
        </p>
        <p className="text-white/60 text-sm">
          {t("users.deleteModal.userLabel", {
            defaultValue: "User: {{name}}",
            name: displayName,
          })}
        </p>
      </div>
    </Modal>
  );
}
