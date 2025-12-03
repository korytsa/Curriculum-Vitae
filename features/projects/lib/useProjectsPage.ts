"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCv } from "@/features/cvs";
import {
  useProjects,
  useProjectsTable,
  TABLE_CONFIG,
  type ProjectModalMode,
  type UseProjectsPageParams,
  type UseProjectsPageResult,
  type UseCvProjectsPageParams,
  type UseCvProjectsPageResult,
  type ProjectFormPayload,
  type AddProjectFormInitialProject,
  type AddProjectModalSubmitPayload,
} from "@/features/projects";
import { useAddProject } from "./useAddProject";
import { useUpdateProject } from "./useUpdateProject";
import { useDeleteProject } from "./useDeleteProject";
import type { CvProject, Project } from "@/shared/graphql/generated";

const mapProjectToCvProject = (project: Project): CvProject => {
  const baseProject = {
    __typename: "Project" as const,
    id: project.id,
    name: project.name,
    created_at: project.created_at,
    description: project.description,
    domain: project.domain,
    environment: project.environment,
    start_date: project.start_date,
    end_date: project.end_date,
  } as Project;

  return {
    __typename: "CvProject" as const,
    id: project.id,
    name: project.name,
    domain: project.domain,
    description: project.description,
    environment: project.environment,
    start_date: project.start_date,
    end_date: project.end_date,
    responsibilities: [],
    roles: [],
    project: baseProject,
  } as CvProject;
};

const buildCvProjectInitialValues = (project: CvProject): AddProjectFormInitialProject => ({
  projectId: project.project?.id ?? "",
  domain: project.domain,
  startDate: project.start_date,
  endDate: project.end_date ?? "",
  description: project.description,
  environment: project.environment ?? [],
  responsibilities: (project.responsibilities ?? []).join("\n"),
});

const buildRegularProjectInitialValues = (project: CvProject): ProjectFormPayload => ({
  name: project.name,
  domain: project.domain,
  startDate: project.start_date,
  endDate: project.end_date || undefined,
  description: project.description,
  environment: project.environment,
});

export function useProjectsPage({ locale }: UseProjectsPageParams): UseProjectsPageResult;
export function useProjectsPage({ cvId, locale }: UseCvProjectsPageParams): UseCvProjectsPageResult;
export function useProjectsPage({ cvId, locale }: { cvId?: string; locale: string }) {
  const { t } = useTranslation();
  const isCvMode = !!cvId;
  const { cv, loading: isCvLoading } = useCv(cvId ?? "");
  const { projects: availableProjects, loading: isProjectsLoading } = useProjects();
  const { addProject } = useAddProject({ cvId });
  const { updateProject } = useUpdateProject({ cvId });
  const { deleteProjectModal, handleDeleteRequest } = useDeleteProject({ cvId });

  const projects = isCvMode ? ((cv?.projects ?? []).filter(Boolean) as unknown as CvProject[]) : availableProjects.map(mapProjectToCvProject);
  const isLoading = isCvMode ? isCvLoading : isProjectsLoading;
  const addProjectLabel = t("cvs.projectsPage.actions.add");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProjectModalMode>("add");
  const [cvInitialValues, setCvInitialValues] = useState<AddProjectFormInitialProject | undefined>(undefined);
  const [regularInitialValues, setRegularInitialValues] = useState<ProjectFormPayload | undefined>(undefined);
  const [projectToUpdate, setProjectToUpdate] = useState<CvProject | null>(null);

  const openModal = (mode: ProjectModalMode, project?: CvProject) => {
    if (mode === "update" && project) {
      if (isCvMode) {
        setCvInitialValues(buildCvProjectInitialValues(project));
      } else {
        setRegularInitialValues(buildRegularProjectInitialValues(project));
        setProjectToUpdate(project);
      }
    } else {
      setCvInitialValues(undefined);
      setRegularInitialValues(undefined);
      setProjectToUpdate(null);
    }
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleAddProject = () => openModal("add");
  const handleEditProject = (project: CvProject) => openModal("update", project);

  const closeModal = () => {
    setIsModalOpen(false);
    setCvInitialValues(undefined);
    setRegularInitialValues(undefined);
    setModalMode("add");
    setProjectToUpdate(null);
  };

  const handleSubmit = async (payload: ProjectFormPayload | AddProjectModalSubmitPayload) => {
    if (modalMode === "update") {
      const projectId = isCvMode ? cvInitialValues?.projectId : projectToUpdate?.id;
      if (!projectId) return;
      await updateProject(payload, isCvMode, projectId);
    } else {
      await addProject(payload, isCvMode);
    }
  };

  const tableConfig = isCvMode
    ? {
        menuWidth: "155px",
        buttonClassName: "text-white hover:bg-white/10",
        iconClassName: "w-5 h-5 text-white",
        mobileSummaryKeys: ["name", "end_date"],
      }
    : {
        menuWidth: TABLE_CONFIG.menuWidth,
        buttonClassName: TABLE_CONFIG.buttonClassName,
        iconClassName: TABLE_CONFIG.iconClassName,
        mobileSummaryKeys: [...TABLE_CONFIG.mobileSummaryKeys],
      };

  const { searchInputProps, tableProps } = useProjectsTable({
    projects,
    locale,
    isLoading,
    onEdit: handleEditProject,
    onDelete: handleDeleteRequest,
    tableConfig,
    emptyStateConfig: isCvMode
      ? {
          showTitle: true,
          emptyTitleKey: "cvs.projectsPage.states.noResults.title",
        }
      : undefined,
  });

  const baseResult = {
    searchInputProps,
    tableProps,
    addProjectLabel,
    handleAddProject,
    deleteProjectModal,
  };

  if (isCvMode) {
    return {
      ...baseResult,
      addProjectModal: {
        open: isModalOpen,
        onClose: closeModal,
        projects: availableProjects,
        isLoading: isProjectsLoading,
        onSubmit: handleSubmit as (payload: AddProjectModalSubmitPayload) => Promise<void>,
        initialProject: cvInitialValues,
        mode: modalMode,
      },
    } as UseCvProjectsPageResult;
  }

  return {
    ...baseResult,
    createProjectModal: {
      open: isModalOpen,
      onClose: closeModal,
      onSubmit: handleSubmit as (payload: ProjectFormPayload) => Promise<void>,
      initialProject: regularInitialValues,
      mode: modalMode,
    },
  } as UseProjectsPageResult;
}
