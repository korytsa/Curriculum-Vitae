"use client";

import { useTranslation } from "react-i18next";
import { Modal, FormStatus, Button } from "@/shared/ui";
import { useDeleteCv } from "../model/useDeleteCv";

interface DeleteCvModalProps {
  open: boolean;
  cvId: string;
  cvName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteCvModal({
  open,
  cvId,
  cvName,
  onClose,
  onSuccess,
}: DeleteCvModalProps) {
  const { t } = useTranslation();
  const { deleteCv, loading, error } = useDeleteCv();

  const handleDelete = async () => {
    try {
      await deleteCv({ cvId });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error deleting CV:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("cvs.deleteModal.title", { defaultValue: "Delete CV" })}
      primaryAction={{
        label: t("cvs.deleteModal.actions.delete", { defaultValue: "DELETE" }),
        onClick: handleDelete,
        disabled: loading,
      }}
      secondaryAction={{
        label: t("cvs.deleteModal.actions.cancel", { defaultValue: "CANCEL" }),
        onClick: onClose,
        disabled: loading,
      }}
    >
      <FormStatus errorMessage={error?.message ?? null} className="mb-4" />

      <div className="space-y-4">
        <p className="text-white/80">
          {t("cvs.deleteModal.warning", {
            defaultValue:
              "Are you sure you want to delete this CV? This action cannot be undone.",
          })}
        </p>
        {cvName && (
          <p className="text-white/60 text-sm">
            {t("cvs.deleteModal.cvName", {
              defaultValue: "CV: {{name}}",
              name: cvName,
            })}
          </p>
        )}
      </div>
    </Modal>
  );
}
