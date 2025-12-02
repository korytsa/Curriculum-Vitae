"use client";

import { useTranslation } from "react-i18next";
import { Input, Modal, TextArea, MultiSelectEnvironmentField } from "@/shared/ui";
import { useProjectForm } from "../lib/useProjectForm";
import type { CreateProjectModalProps } from "../types";
import { MODAL_CONFIG, FORM_FIELDS, TECHNOLOGY_OPTIONS } from "../config/constants";

export function CreateProjectModal({ open, onClose, onSubmit, initialProject, mode = "add" }: CreateProjectModalProps) {
  const { t } = useTranslation();
  const { formState, handleFieldChange, handleSubmit, handleClose, isSubmitting, disableSubmit } = useProjectForm({
    onClose,
    initialProject,
    onSubmit: onSubmit
      ? async (payload) => {
          await onSubmit({
            name: payload.name,
            domain: payload.domain,
            startDate: payload.startDate,
            endDate: payload.endDate || undefined,
            description: payload.description,
            environment: payload.environment,
          });
        }
      : undefined,
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "update" ? t("cvs.projectsPage.modal.updateTitle") : MODAL_CONFIG.createTitle}
      className={MODAL_CONFIG.className}
      primaryAction={{
        label: mode === "update" ? t("cvs.projectsPage.modal.actions.update") : MODAL_CONFIG.createButtonLabel,
        onClick: handleSubmit,
        disabled: disableSubmit,
      }}
      secondaryAction={{
        label: t("cvs.projectsPage.modal.actions.cancel"),
        onClick: handleClose,
        disabled: isSubmitting,
      }}
    >
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Input label={FORM_FIELDS.nameLabel} value={formState.name} onChange={(event) => handleFieldChange("name", event.currentTarget.value)} />
          <Input label={t("cvs.projectsPage.modal.fields.domain")} value={formState.domain} onChange={(event) => handleFieldChange("domain", event.currentTarget.value)} />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Input
            type="date"
            label={t("cvs.projectsPage.modal.fields.startDate")}
            value={formState.startDate}
            onChange={(event) => handleFieldChange("startDate", event.currentTarget.value)}
          />
          <Input
            type="date"
            label={t("cvs.projectsPage.modal.fields.endDate")}
            value={formState.endDate}
            onChange={(event) => handleFieldChange("endDate", event.currentTarget.value)}
          />
        </div>
        <TextArea
          id="project-description"
          label={t("cvs.projectsPage.modal.fields.description")}
          value={formState.description}
          rows={FORM_FIELDS.descriptionRows}
          onChange={(event) => handleFieldChange("description", event.currentTarget.value)}
        />
        <MultiSelectEnvironmentField
          label={t("cvs.projectsPage.modal.fields.environment")}
          values={formState.environment}
          onChange={(values) => handleFieldChange("environment", values)}
          placeholder={FORM_FIELDS.environmentPlaceholder}
          options={[...TECHNOLOGY_OPTIONS]}
        />
      </div>
    </Modal>
  );
}
