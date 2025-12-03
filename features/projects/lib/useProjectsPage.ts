"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
  useDeleteProjectModal,
  useProjectsTable,
  TABLE_CONFIG,
  type ProjectModalMode,
  type UseProjectsPageParams,
  type UseProjectsPageResult,
  type ProjectFormPayload,
} from "@/features/projects";
import type { CvProject } from "@/shared/graphql/generated";

export function useProjectsPage({ locale }: UseProjectsPageParams): UseProjectsPageResult {
  const { t } = useTranslation();
  const { projects: availableProjects, loading: isProjectsLoading } = useProjects();
  const { createProject } = useCreateProject();
  const { deleteProject, loading: isDeleteProjectLoading, error: deleteProjectError } = useDeleteProject();
  const { updateProject } = useUpdateProject();

  const adminProjects: CvProject[] = availableProjects.map((project) => {
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
    } as import("@/shared/graphql/generated").Project;

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
  });

  const addProjectLabel = t("cvs.projectsPage.actions.add");

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<ProjectModalMode>("add");
  const [projectModalInitialValues, setProjectModalInitialValues] = useState<ProjectFormPayload | undefined>(undefined);
  const [projectToUpdate, setProjectToUpdate] = useState<CvProject | null>(null);
  const { deleteProjectModal, handleDeleteRequest } = useDeleteProjectModal({
    onDelete: async (projectId) => {
      await deleteProject({ projectId });
    },
    loading: isDeleteProjectLoading,
    error: deleteProjectError,
  });

  const handleAddProject = () => {
    setProjectModalMode("add");
    setProjectModalInitialValues(undefined);
    setProjectToUpdate(null);
    setIsCreateProjectModalOpen(true);
  };

  const handleEditProject = (project: CvProject) => {
    setProjectToUpdate(project);
    setProjectModalMode("update");
    setProjectModalInitialValues({
      name: project.name,
      domain: project.domain,
      startDate: project.start_date,
      endDate: project.end_date || undefined,
      description: project.description,
      environment: project.environment,
    });
    setIsCreateProjectModalOpen(true);
  };

  const handleCreateProjectSubmit = async (payload: ProjectFormPayload) => {
    if (projectModalMode === "update" && projectToUpdate) {
      await updateProject({
        projectId: projectToUpdate.id,
        name: payload.name,
        domain: payload.domain,
        description: payload.description,
        environment: payload.environment,
        start_date: payload.startDate,
        end_date: payload.endDate,
      });
    } else {
      await createProject({
        name: payload.name,
        domain: payload.domain,
        description: payload.description,
        environment: payload.environment,
        start_date: payload.startDate,
        end_date: payload.endDate,
      });
    }
  };

  const handleCloseCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
    setProjectModalInitialValues(undefined);
    setProjectModalMode("add");
    setProjectToUpdate(null);
  };

  const { searchInputProps, tableProps } = useProjectsTable({
    projects: adminProjects,
    locale,
    isLoading: isProjectsLoading,
    onEdit: handleEditProject,
    onDelete: handleDeleteRequest,
    tableConfig: {
      menuWidth: TABLE_CONFIG.menuWidth,
      buttonClassName: TABLE_CONFIG.buttonClassName,
      iconClassName: TABLE_CONFIG.iconClassName,
      mobileSummaryKeys: [...TABLE_CONFIG.mobileSummaryKeys],
    },
  });

  return {
    searchInputProps,
    tableProps,
    addProjectLabel,
    handleAddProject,
    createProjectModal: {
      open: isCreateProjectModalOpen,
      onClose: handleCloseCreateProjectModal,
      onSubmit: handleCreateProjectSubmit,
      initialProject: projectModalInitialValues,
      mode: projectModalMode,
    },
    deleteProjectModal,
  };
}
