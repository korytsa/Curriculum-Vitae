"use client";

import { useEffect, useState } from "react";
import { useUpdateProject as useUpdateProjectMutation, PROJECT_FORM_INITIAL_STATE } from "@/features/projects";
import { useUpdateCvProject } from "@/features/cvs";
import type { ProjectFormPayload, AddProjectModalSubmitPayload, ProjectFormState, UseUpdateProjectParams, UseUpdateProjectResult } from "@/features/projects";

export function useUpdateProject({ cvId, onClose, onSubmit, initialProject }: UseUpdateProjectParams = {}): UseUpdateProjectResult {
  const { updateProject: updateRegularProject, loading: isUpdateLoading, error: updateError } = useUpdateProjectMutation();
  const { updateCvProject, loading: isUpdateCvLoading, error: updateCvError } = useUpdateCvProject(cvId);

  const [formState, setFormState] = useState<ProjectFormState>(PROJECT_FORM_INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setFormState({
        name: initialProject.name,
        domain: initialProject.domain,
        startDate: initialProject.startDate,
        endDate: initialProject.endDate || "",
        description: initialProject.description,
        environment: initialProject.environment,
      });
    } else {
      setFormState(PROJECT_FORM_INITIAL_STATE);
    }
  }, [initialProject]);

  const updateProject = async (payload: ProjectFormPayload | AddProjectModalSubmitPayload, isCvProject = false, projectId?: string) => {
    if (!projectId) {
      return;
    }

    if (isCvProject && cvId) {
      const cvProjectPayload = payload as AddProjectModalSubmitPayload;
      await updateCvProject({
        projectId,
        start_date: cvProjectPayload.startDate,
        end_date: cvProjectPayload.endDate,
        responsibilities: cvProjectPayload.responsibilities,
        roles: cvProjectPayload.responsibilities,
      });
    } else {
      const projectPayload = payload as ProjectFormPayload;
      await updateRegularProject({
        projectId,
        name: projectPayload.name,
        domain: projectPayload.domain,
        description: projectPayload.description,
        environment: projectPayload.environment,
        start_date: projectPayload.startDate,
        end_date: projectPayload.endDate,
      });
    }
  };

  const handleClose = () => {
    setFormState(PROJECT_FORM_INITIAL_STATE);
    onClose?.();
  };

  const handleFieldChange = <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.startDate || !onSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formState);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = cvId ? isUpdateCvLoading : isUpdateLoading;
  const error = (cvId ? updateCvError : updateError) as Error | null;
  const disableSubmit = !formState.name || !formState.startDate || isSubmitting;

  const baseResult: UseUpdateProjectResult = {
    updateProject,
    loading,
    error,
  };

  if (onClose !== undefined || onSubmit !== undefined) {
    return {
      ...baseResult,
      formState,
      handleFieldChange,
      handleSubmit,
      handleClose,
      isSubmitting,
      disableSubmit,
    };
  }

  return baseResult;
}
