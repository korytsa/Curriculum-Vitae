"use client";

import { useTranslation } from "react-i18next";
import { Modal } from "@/shared/ui";
import { useAddProject } from "../lib/useAddProject";
import { useUpdateProject } from "../lib/useUpdateProject";
import type { AddProjectFormState, ProjectFormState } from "@/features/projects";
import type { UnifiedProjectModalProps } from "./types";
import { UserProjectForm } from "./UserProjectForm";
import { AdminProjectForm } from "./AdminProjectForm";

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
          await createProps.onSubmit!({
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

  const isValidAddToCvForm =
    variant === "add-to-cv" && addToCvForm.formState && addToCvForm.projectOptions && addToCvForm.handleFieldChange && addToCvForm.handleSubmit && addToCvForm.handleClose;

  const isValidCreateForm = variant === "create" && createForm.formState && createForm.handleFieldChange && createForm.handleSubmit && createForm.handleClose;

  if (variant === "add-to-cv" && !isValidAddToCvForm) return null;
  if (variant === "create" && !isValidCreateForm) return null;

  const title =
    variant === "add-to-cv"
      ? mode === "update"
        ? t("cvs.projectsPage.modal.updateTitle")
        : t("cvs.projectsPage.modal.title")
      : mode === "update"
        ? t("cvs.projectsPage.modal.updateTitle")
        : t("cvs.projectsPage.modal.createTitle");

  const primaryLabel =
    variant === "add-to-cv"
      ? mode === "update"
        ? t("cvs.projectsPage.modal.actions.update")
        : t("cvs.projectsPage.modal.actions.submit")
      : mode === "update"
        ? t("cvs.projectsPage.modal.actions.update")
        : t("cvs.projectsPage.modal.actions.create");

  return (
    <Modal
      open={open}
      onClose={variant === "add-to-cv" ? addToCvForm.handleClose! : createForm.handleClose!}
      title={title}
      className="max-w-4xl"
      primaryAction={{
        label: primaryLabel,
        onClick: variant === "add-to-cv" ? addToCvForm.handleSubmit! : createForm.handleSubmit!,
        disabled: (variant === "add-to-cv" ? addToCvForm.disableSubmit : createForm.disableSubmit) ?? false,
      }}
      secondaryAction={{
        label: t("cvs.projectsPage.modal.actions.cancel"),
        onClick: variant === "add-to-cv" ? addToCvForm.handleClose! : createForm.handleClose!,
        disabled: (variant === "add-to-cv" ? addToCvForm.isSubmitting : createForm.isSubmitting) ?? false,
      }}
    >
      {variant === "add-to-cv" ? (
        <UserProjectForm
          formState={addToCvForm.formState as AddProjectFormState}
          projectOptions={addToCvForm.projectOptions!}
          mode={mode}
          isProjectListLoading={addToCvProps?.isProjectListLoading}
          onFieldChange={addToCvForm.handleFieldChange as <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => void}
        />
      ) : (
        <AdminProjectForm
          formState={createForm.formState as ProjectFormState}
          onFieldChange={createForm.handleFieldChange as <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => void}
        />
      )}
    </Modal>
  );
}
