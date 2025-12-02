"use client";

import { useEffect, useState } from "react";
import { PROJECT_FORM_INITIAL_STATE, type ProjectFormState, type UseProjectFormParams, type UseProjectFormResult, type ProjectFormPayload } from "@/features/projects";

export function useProjectForm({ onClose, onSubmit, initialProject }: UseProjectFormParams): UseProjectFormResult {
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

  const handleClose = () => {
    setFormState(PROJECT_FORM_INITIAL_STATE);
    onClose();
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

  const disableSubmit = !formState.name || !formState.startDate || isSubmitting;

  return {
    formState,
    handleFieldChange,
    handleSubmit,
    handleClose,
    isSubmitting,
    disableSubmit,
  };
}
