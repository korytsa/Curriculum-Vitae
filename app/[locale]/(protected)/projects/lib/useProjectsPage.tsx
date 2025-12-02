"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjects, useCreateProject, useDeleteProject, useUpdateProject } from "@/features/projects";
import type { CvProject } from "@/shared/graphql/generated";
import { Loader, type SearchInputProps, type TableProps, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { createCvProjectsColumns } from "@/app/[locale]/(protected)/cvs/[id]/projects/config/constants";
import { formatDate, sortProjects, useProjectSearchState } from "@/app/[locale]/(protected)/cvs/[id]/projects/lib/utils";
import type { CvProjectsActiveField, CvProjectsDirection } from "@/app/[locale]/(protected)/cvs/[id]/projects/types";
import type { UseProjectsPageParams, UseProjectsPageResult, ProjectFormPayload, ProjectModalMode } from "../types";
import { TABLE_CONFIG, SORT_CONFIG } from "../config/constants";

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

  const [{ field: activeField, direction }, setSortState] = useState<{
    field: CvProjectsActiveField | null;
    direction: CvProjectsDirection;
  }>({
    field: null,
    direction: SORT_CONFIG.defaultDirection,
  });

  const toggleField = (field: CvProjectsActiveField) => {
    setSortState((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const addProjectLabel = t("cvs.projectsPage.actions.add");
  const searchPlaceholder = t("cvs.projectsPage.search.placeholder");
  const dateTimeLocale = locale && Intl.DateTimeFormat.supportedLocalesOf([locale]).length ? locale : undefined;

  const { searchInputProps, filteredProjects, hasSearchQuery, handleResetSearch } = useProjectSearchState(adminProjects, searchPlaceholder);
  const sortedProjects = sortProjects(filteredProjects, activeField, direction);

  const formatDateValue = (value?: string | null) => formatDate(value, dateTimeLocale, t("cvs.projectsPage.table.labels.present"));

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<ProjectModalMode>("add");
  const [projectModalInitialValues, setProjectModalInitialValues] = useState<ProjectFormPayload | undefined>(undefined);
  const [projectToUpdate, setProjectToUpdate] = useState<CvProject | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectPendingDelete, setProjectPendingDelete] = useState<CvProject | null>(null);

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

  const handleDeleteRequest = (project: CvProject) => {
    setProjectPendingDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectPendingDelete(null);
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectPendingDelete) {
      return;
    }

    const projectId = projectPendingDelete.project?.id ?? projectPendingDelete.id;

    if (!projectId) {
      return;
    }

    await deleteProject({ projectId });
    handleCloseDeleteModal();
  };

  const emptyState = isProjectsLoading ? (
    <Loader className="mx-auto my-8" />
  ) : hasSearchQuery ? (
    <div className="py-8 text-center">
      <p className="text-white/60">{t("cvs.projectsPage.search.noResults")}</p>
      <button type="button" onClick={handleResetSearch} className="mt-2 text-red-500 hover:text-red-400">
        {t("cvs.projectsPage.search.reset")}
      </button>
    </div>
  ) : (
    <div className="py-8 text-center text-white/60">{t("cvs.projectsPage.table.empty")}</div>
  );

  const columns = createCvProjectsColumns({
    t,
    formatDate: formatDateValue,
    onToggleName: () => toggleField("name"),
    onToggleDomain: () => toggleField("domain"),
    onToggleStartDate: () => toggleField("start_date"),
    onToggleEndDate: () => toggleField("end_date"),
    activeField,
    direction,
    renderRowActions: (row) => {
      const menuItems: DropdownMenuItem[] = [
        {
          label: t("cvs.projectsPage.actions.update"),
          onClick: () => handleEditProject(row),
        },
        {
          label: t("cvs.projectsPage.actions.remove"),
          onClick: () => handleDeleteRequest(row),
        },
      ];

      return (
        <TableRowActions
          items={menuItems}
          ariaLabel={t("cvs.projectsPage.actions.openMenu")}
          menuWidth={TABLE_CONFIG.menuWidth}
          buttonClassName={TABLE_CONFIG.buttonClassName}
          iconClassName={TABLE_CONFIG.iconClassName}
        />
      );
    },
  });

  const tableProps: TableProps<CvProject> = {
    data: sortedProjects,
    columns,
    keyExtractor: (row) => row.id,
    emptyState,
    mobileSummaryKeys: [...TABLE_CONFIG.mobileSummaryKeys],
  };

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
    deleteProjectModal: {
      open: isDeleteModalOpen,
      onClose: handleCloseDeleteModal,
      onConfirm: handleConfirmDeleteProject,
      projectName: projectPendingDelete?.name,
      isLoading: isDeleteProjectLoading,
      errorMessage: deleteProjectError?.message ?? null,
    },
  };
}
