"use client";

import { useTranslation } from "react-i18next";

import { EnvironmentField, Input, Modal, Select, TextArea } from "@/shared/ui";
import { useAddProjectForm } from "../lib/useAddProjectForm";
import type { AddProjectModalProps } from "@/features/projects";

export function AddProjectModal({ open, onClose, projects, isProjectListLoading, onSubmit, initialProject, mode = "add" }: AddProjectModalProps) {
  const { t } = useTranslation();
  const { formState, projectOptions, handleFieldChange, handleSubmit, handleClose, isSubmitting, disableSubmit } = useAddProjectForm({
    projects,
    onClose,
    onSubmit,
    initialProject,
  });

  const modalTitle = mode === "update" ? t("cvs.projectsPage.modal.updateTitle") : t("cvs.projectsPage.modal.title");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      className="max-w-4xl"
      primaryAction={{
        label: mode === "update" ? t("cvs.projectsPage.modal.actions.update") : t("cvs.projectsPage.modal.actions.submit"),
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
          <Select
            align="bottom"
            label={t("cvs.projectsPage.modal.fields.project")}
            options={projectOptions}
            value={formState.projectId}
            onChange={(value) => handleFieldChange("projectId", value)}
            disabled={mode === "update" || isProjectListLoading}
          />
          <Input label={t("cvs.projectsPage.modal.fields.domain")} value={formState.domain} readOnly disabled />
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
        <TextArea id="project-description" label={t("cvs.projectsPage.modal.fields.description")} value={formState.description} rows={5} readOnly />
        <EnvironmentField label={t("cvs.projectsPage.modal.fields.environment")} values={formState.environment} />
        <TextArea
          id="project-responsibilities"
          label={t("cvs.projectsPage.modal.fields.responsibilities")}
          placeholder={t("cvs.projectsPage.modal.fields.responsibilitiesPlaceholder")}
          value={formState.responsibilities}
          onChange={(event) => handleFieldChange("responsibilities", event.currentTarget.value)}
        />
      </div>
    </Modal>
  );
}
