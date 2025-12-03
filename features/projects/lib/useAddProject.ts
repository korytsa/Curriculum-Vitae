"use client";

import { useEffect, useRef, useState } from "react";
import { useCreateProject, EMPTY_PROJECTS, ADD_PROJECT_FORM_INITIAL_STATE } from "@/features/projects";
import { useAddCvProject } from "@/features/cvs";
import type {
  ProjectFormPayload,
  AddProjectModalSubmitPayload,
  AddProjectFormState,
  ProjectOption,
  UseAddProjectParams,
  UseAddProjectResult,
} from "@/features/projects";
import type { Project } from "@/shared/graphql/generated";

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

export function useAddProject({ cvId, projects, onClose, onSubmit, initialProject }: UseAddProjectParams = {}): UseAddProjectResult {
  const { createProject, loading: isCreateLoading, error: createError } = useCreateProject();
  const { addCvProject, loading: isAddCvLoading, error: addCvError } = useAddCvProject(cvId);

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
      : ADD_PROJECT_FORM_INITIAL_STATE
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

  const addProject = async (payload: ProjectFormPayload | AddProjectModalSubmitPayload, isCvProject = false) => {
    if (isCvProject && cvId) {
      const cvProjectPayload = payload as AddProjectModalSubmitPayload;
      await addCvProject({
        projectId: cvProjectPayload.projectId,
        start_date: cvProjectPayload.startDate,
        end_date: cvProjectPayload.endDate,
        responsibilities: cvProjectPayload.responsibilities,
        roles: cvProjectPayload.responsibilities,
      });
    } else {
      const projectPayload = payload as ProjectFormPayload;
      await createProject({
        name: projectPayload.name,
        domain: projectPayload.domain,
        description: projectPayload.description,
        environment: projectPayload.environment,
        start_date: projectPayload.startDate,
        end_date: projectPayload.endDate,
      });
    }
  };

  const resetForm = () => {
    setFormState(ADD_PROJECT_FORM_INITIAL_STATE);
    lastProjectId.current = null;
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
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

  const loading = cvId ? isAddCvLoading : isCreateLoading;
  const error = (cvId ? addCvError : createError) as Error | null;
  const disableSubmit = !formState.projectId || !formState.startDate || isSubmitting;

  const baseResult: UseAddProjectResult = {
    addProject,
    loading,
    error,
  };

  if (projects !== undefined) {
    return {
      ...baseResult,
      formState,
      projectOptions,
      handleFieldChange,
      handleSubmit,
      handleClose,
      isSubmitting,
      disableSubmit,
    };
  }

  return baseResult;
}
