"use client";

import { useEffect, useRef, useState } from "react";

import type { Project } from "@/shared/graphql/generated";

export type AddProjectModalSubmitPayload = {
  projectId: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
};

export type AddProjectFormInitialProject = {
  projectId: string;
  domain: string;
  startDate: string;
  endDate?: string;
  description: string;
  environment: string[];
  responsibilities: string;
};

export type AddProjectFormState = {
  projectId: string;
  domain: string;
  startDate: string;
  endDate: string;
  description: string;
  environment: string[];
  responsibilities: string;
};

type ProjectOption = {
  value: string;
  label: string;
};

const EMPTY_PROJECTS: Project[] = [];

const INITIAL_FORM_STATE: AddProjectFormState = {
  projectId: "",
  domain: "",
  startDate: "",
  endDate: "",
  description: "",
  environment: [],
  responsibilities: "",
};

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

type UseAddProjectFormParams = {
  projects?: Project[];
  onClose: () => void;
  onSubmit?: (payload: AddProjectModalSubmitPayload) => Promise<void> | void;
  initialProject?: AddProjectFormInitialProject;
};

type UseAddProjectFormResult = {
  formState: AddProjectFormState;
  projectOptions: ProjectOption[];
  handleFieldChange: <K extends keyof AddProjectFormState>(field: K, value: AddProjectFormState[K]) => void;
  handleSubmit: () => Promise<void> | void;
  handleClose: () => void;
  isSubmitting: boolean;
  disableSubmit: boolean;
  submitError: string | null;
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
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    setSubmitError(null);
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

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save project");
      return;
    } finally {
      setIsSubmitting(false);
    }
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
    submitError,
  };
}
