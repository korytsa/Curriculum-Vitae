"use client";

import { useEffect, useRef, useState } from "react";

import type { Project } from "@/shared/graphql/generated";
import { EMPTY_PROJECTS, INITIAL_FORM_STATE } from "../config/constants";
import type { AddProjectFormState, AddProjectModalSubmitPayload, ProjectOption, UseAddProjectFormParams, UseAddProjectFormResult } from "../types";

const sanitizeList = (list: string[]) => list.map((item) => item.trim()).filter((item, index, array) => item && array.indexOf(item) === index);

const splitResponsibilities = (value: string) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item, index, array) => item && array.indexOf(item) === index);

const cleanProjectName = (name: string): string => {
  if (!name) return name;

  let cleaned = name.trim();
  cleaned = cleaned.replace(/-\w{2}\/\w+$/i, "");
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");
  cleaned = cleaned.replace(/\bproject\b/gi, "Project");
  cleaned = cleaned.replace(/\s+/g, " ");

  return cleaned.trim();
};

const buildProjectOptions = (projects: Project[]): ProjectOption[] => {
  if (!projects.length) {
    return [];
  }
  return projects
    .map((project) => {
      const rawName = project.name || "";
      const cleanedName = cleanProjectName(rawName);
      return {
        value: project.id,
        label: cleanedName,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
};

export function useAddProjectForm({ projects, onClose, onSubmit, initialProject }: UseAddProjectFormParams): UseAddProjectFormResult {
  const [formState, setFormState] = useState<AddProjectFormState>(
    initialProject
      ? {
          projectId: initialProject.projectId,
          domain: initialProject.domain,
          startDate: initialProject.startDate,
          endDate: initialProject.endDate || "",
          description: initialProject.description,
          environment: initialProject.environment,
          responsibilities: initialProject.responsibilities,
        }
      : INITIAL_FORM_STATE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastProjectId = useRef<string | null>(null);

  const availableProjects = projects ?? EMPTY_PROJECTS;
  const projectOptions = buildProjectOptions(availableProjects);
  const selectedProject = availableProjects.find((project) => project.id === formState.projectId) ?? null;

  useEffect(() => {
    if (initialProject) {
      setFormState({
        projectId: initialProject.projectId,
        domain: initialProject.domain,
        startDate: initialProject.startDate,
        endDate: initialProject.endDate || "",
        description: initialProject.description,
        environment: initialProject.environment,
        responsibilities: initialProject.responsibilities,
      });
      lastProjectId.current = initialProject.projectId;
      return;
    }
  }, [initialProject]);

  useEffect(() => {
    if (!selectedProject) {
      lastProjectId.current = null;
      return;
    }
    if (lastProjectId.current === selectedProject.id) {
      return;
    }
    lastProjectId.current = selectedProject.id;
    setFormState((prev) => ({
      ...prev,
      domain: selectedProject.domain ?? "",
      startDate: selectedProject.start_date ?? "",
      endDate: selectedProject.end_date ?? "",
      description: selectedProject.description ?? "",
      environment: sanitizeList(selectedProject.environment ?? []),
    }));
  }, [selectedProject]);

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
    lastProjectId.current = null;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFieldChange = <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formState.projectId || !formState.startDate) {
      return;
    }

    const payload: AddProjectModalSubmitPayload = {
      projectId: formState.projectId,
      startDate: formState.startDate,
      endDate: formState.endDate || undefined,
      responsibilities: splitResponsibilities(formState.responsibilities),
    };

    if (!onSubmit) {
      handleClose();
      return;
    }

    setIsSubmitting(true);
    await onSubmit(payload);
    setIsSubmitting(false);
    handleClose();
  };

  const disableSubmit = !formState.projectId || !formState.startDate || isSubmitting;

  return {
    formState,
    projectOptions,
    handleFieldChange,
    handleSubmit,
    handleClose,
    isSubmitting,
    disableSubmit,
  };
}
