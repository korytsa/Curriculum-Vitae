"use client";

import { useTranslation } from "react-i18next";
import { Modal } from "@/shared/ui";
import type { AdminSkillModalProps } from "../../types";
import { AdminSkillForm } from "./AdminSkillForm";

export function AdminSkillModal(props: AdminSkillModalProps) {
  const { open, onClose, mode = "create", formState, onFieldChange, onSubmit, isLoading = false, isValid = false } = props;
  const { t } = useTranslation();

  const title = mode === "update" ? t("admin.skills.form.updateTitle") : t("admin.skills.form.createTitle");
  const primaryLabel = mode === "update" ? t("admin.skills.form.confirm") : t("admin.skills.form.create");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      primaryAction={{
        label: primaryLabel,
        onClick: onSubmit,
        disabled: isLoading || !isValid,
        variant: "danger",
      }}
      secondaryAction={{
        label: t("admin.skills.form.cancel"),
        onClick: onClose,
      }}
    >
      <AdminSkillForm formState={formState} onFieldChange={onFieldChange} />
    </Modal>
  );
}
