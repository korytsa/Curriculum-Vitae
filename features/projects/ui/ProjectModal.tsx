"use client";

import { useTranslation } from "react-i18next";

import { EnvironmentField, Input, Modal, Select, TextArea, MultiSelectEnvironmentField } from "@/shared/ui";
import { useAddProject } from "../lib/useAddProject";
import { useUpdateProject } from "../lib/useUpdateProject";
import { FORM_FIELDS, TECHNOLOGY_OPTIONS, type CreateProjectModalProps, type AddProjectModalProps } from "@/features/projects";

type ProjectModalVariant = "add-to-cv" | "create";

type UnifiedProjectModalProps =
  | (Omit<AddProjectModalProps, "mode"> & { variant: "add-to-cv"; mode?: "add" | "update" })
  | (Omit<CreateProjectModalProps, "mode"> & { variant: "create"; mode?: "add" | "update" });

export function ProjectModal(props: UnifiedProjectModalProps) {
  const { open, onClose, mode = "add", variant } = props;
  const { t } = useTranslation();

  const addToCvProps = variant === "add-to-cv" ? props : null;
  const createProps = variant === "create" ? props : null;

  const addToCvForm = useAddProject({
    projects: addToCvProps?.projects,
    onClose: onClose || (() => {}),
    onSubmit: addToCvProps?.onSubmit,
    initialProject: addToCvProps?.initialProject,
  });

  const createForm = useUpdateProject({
    onClose: onClose || (() => {}),
    initialProject: createProps?.initialProject,
    onSubmit: createProps?.onSubmit
      ? async (payload) => {
          if (createProps?.onSubmit) {
            await createProps.onSubmit({
              name: payload.name,
              domain: payload.domain,
              startDate: payload.startDate,
              endDate: payload.endDate || undefined,
              description: payload.description,
              environment: payload.environment,
            });
          }
        }
      : async () => {},
  });

  if (variant === "add-to-cv") {
    const { projects, isProjectListLoading } = props;
    if (!addToCvForm.formState || !addToCvForm.projectOptions || !addToCvForm.handleFieldChange || !addToCvForm.handleSubmit || !addToCvForm.handleClose) {
      return null;
    }
    const { formState, projectOptions, handleFieldChange, handleSubmit, handleClose, isSubmitting, disableSubmit } = addToCvForm;
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

  if (!createForm.formState || !createForm.handleFieldChange || !createForm.handleSubmit || !createForm.handleClose) {
    return null;
  }
  const { formState, handleFieldChange, handleSubmit, handleClose, isSubmitting, disableSubmit } = createForm;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "update" ? t("cvs.projectsPage.modal.updateTitle") : t("cvs.projectsPage.modal.createTitle")}
      className="max-w-4xl"
      primaryAction={{
        label: mode === "update" ? t("cvs.projectsPage.modal.actions.update") : t("cvs.projectsPage.modal.actions.create"),
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
          <Input label={t("cvs.projectsPage.modal.fields.name")} value={formState.name} onChange={(event) => handleFieldChange("name", event.currentTarget.value)} />
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
          placeholder={t("cvs.projectsPage.modal.fields.environmentPlaceholder")}
          options={[...TECHNOLOGY_OPTIONS]}
        />
      </div>
    </Modal>
  );
}
