"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { FormStatus } from "./form-status";
import { Modal } from "./modal";

export type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  children?: ReactNode;
};

export function ConfirmDeleteModal({ open, title, onConfirm, onClose, isLoading, errorMessage, children }: ConfirmDeleteModalProps) {
  const { t } = useTranslation();
  const confirmLabel = t("confirmDeleteModal.actions.delete");
  const cancelLabel = t("confirmDeleteModal.actions.cancel");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        disabled: isLoading,
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: onClose,
        disabled: isLoading,
      }}
    >
      <FormStatus errorMessage={errorMessage ?? null} className="mb-2" />
      {children ? <div className="text-white text-[15px]">{children}</div> : null}
    </Modal>
  );
}
