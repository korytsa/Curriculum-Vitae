"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddCvProject, useCv, useRemoveCvProject, useUpdateCvProject } from "@/features/cvs";
import { useProjects, useDeleteProjectModal, useProjectsTable, type ProjectModalMode } from "@/features/projects";
import type { CvProject } from "@/shared/graphql/generated";
import type { AddProjectFormInitialProject, AddProjectModalSubmitPayload, UseCvProjectsPageParams, UseCvProjectsPageResult } from "@/features/projects";

export function useCvProjectsPage({ cvId, locale }: UseCvProjectsPageParams): UseCvProjectsPageResult {
  const { t } = useTranslation();
  const { cv, loading: isCvLoading } = useCv(cvId);
  const { projects: availableProjects, loading: isProjectsLoading } = useProjects();
  const { addCvProject } = useAddCvProject(cvId);
  const { updateCvProject } = useUpdateCvProject(cvId);
  const { removeCvProject, loading: isRemoveProjectLoading, error: removeProjectError } = useRemoveCvProject(cvId);

  const projects = (cv?.projects ?? []).filter(Boolean) as unknown as CvProject[];
  const addProjectLabel = t("cvs.projectsPage.actions.add");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<ProjectModalMode>("add");
  const [projectModalInitialValues, setProjectModalInitialValues] = useState<AddProjectFormInitialProject | undefined>(undefined);
  const { deleteProjectModal, handleDeleteRequest } = useDeleteProjectModal({
    onDelete: async (projectId) => {
      await removeCvProject({ projectId });
    },
    loading: isRemoveProjectLoading,
    error: removeProjectError,
  });

  const buildInitialProjectValues = (project: CvProject): AddProjectFormInitialProject => ({
    projectId: project.project?.id ?? "",
    domain: project.domain,
    startDate: project.start_date,
    endDate: project.end_date ?? "",
    description: project.description,
    environment: project.environment ?? [],
    responsibilities: (project.responsibilities ?? []).join("\n"),
  });

  const openProjectModal = (mode: ProjectModalMode, project?: CvProject) => {
    if (mode === "update" && project) {
      setProjectModalInitialValues(buildInitialProjectValues(project));
    } else {
      setProjectModalInitialValues(undefined);
    }
    setProjectModalMode(mode);
    setIsProjectModalOpen(true);
  };

  const handleAddProject = () => {
    openProjectModal("add");
  };

  const handleEditProject = (project: CvProject) => {
    openProjectModal("update", project);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectModalInitialValues(undefined);
    setProjectModalMode("add");
  };

  const handleProjectModalSubmit = async (payload: AddProjectModalSubmitPayload) => {
    if (projectModalMode === "update") {
      if (!projectModalInitialValues?.projectId) {
        return;
      }
      await updateCvProject({
        projectId: projectModalInitialValues.projectId,
        start_date: payload.startDate,
        end_date: payload.endDate,
        responsibilities: payload.responsibilities,
        roles: payload.responsibilities,
      });
      return;
    }

    await addCvProject({
      projectId: payload.projectId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      responsibilities: payload.responsibilities,
      roles: payload.responsibilities,
    });
  };

  const { searchInputProps, tableProps } = useProjectsTable({
    projects,
    locale,
    isLoading: isCvLoading,
    onEdit: handleEditProject,
    onDelete: handleDeleteRequest,
    tableConfig: {
      menuWidth: "155px",
      buttonClassName: "text-white hover:bg-white/10",
      iconClassName: "w-5 h-5 text-white",
      mobileSummaryKeys: ["name", "end_date"],
    },
    emptyStateConfig: {
      showTitle: true,
      emptyTitleKey: "cvs.projectsPage.states.noResults.title",
    },
  });

  return {
    searchInputProps,
    tableProps,
    addProjectLabel,
    handleAddProject,
    addProjectModal: {
      open: isProjectModalOpen,
      onClose: handleCloseProjectModal,
      projects: availableProjects,
      isLoading: isProjectsLoading,
      onSubmit: handleProjectModalSubmit,
      initialProject: projectModalInitialValues,
      mode: projectModalMode,
    },
    deleteProjectModal,
  };
}
