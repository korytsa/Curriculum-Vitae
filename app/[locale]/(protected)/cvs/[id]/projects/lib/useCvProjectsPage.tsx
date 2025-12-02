"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddCvProject, useCv, useRemoveCvProject, useUpdateCvProject } from "@/features/cvs";
import { useProjects } from "@/features/projects";
import type { CvProject } from "@/shared/graphql/generated";
import { Loader, type TableProps, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { createCvProjectsColumns } from "../config/constants";
import { formatDate, sortProjects, useProjectSearchState } from "./utils";
import type {
  AddProjectFormInitialProject,
  AddProjectModalSubmitPayload,
  CvProjectsActiveField,
  CvProjectsDirection,
  ProjectModalMode,
  UseCvProjectsPageParams,
  UseCvProjectsPageResult,
} from "../types";

export function useCvProjectsPage({ cvId, locale }: UseCvProjectsPageParams): UseCvProjectsPageResult {
  const { t } = useTranslation();
  const { cv, loading: isCvLoading } = useCv(cvId);
  const { projects: availableProjects, loading: isProjectsLoading } = useProjects();
  const { addCvProject } = useAddCvProject(cvId);
  const { updateCvProject } = useUpdateCvProject(cvId);
  const { removeCvProject, loading: isRemoveProjectLoading, error: removeProjectError } = useRemoveCvProject(cvId);

  const projects = (cv?.projects ?? []).filter(Boolean) as CvProject[];
  const [{ field: activeField, direction }, setSortState] = useState<{
    field: CvProjectsActiveField | null;
    direction: CvProjectsDirection;
  }>({
    field: null,
    direction: "desc",
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

  const { searchInputProps, filteredProjects, hasSearchQuery, handleResetSearch } = useProjectSearchState(projects, searchPlaceholder);
  const sortedProjects = sortProjects(filteredProjects, activeField, direction);

  const formatDateValue = (value?: string | null) => formatDate(value, dateTimeLocale, t("cvs.projectsPage.table.labels.present"));

  const emptyState = (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 py-20 text-center">
      {isCvLoading ? (
        <Loader size="lg" />
      ) : (
        <>
          <h3 className="text-xl text-white">{t("cvs.projectsPage.states.noResults.title")}</h3>
          {hasSearchQuery ? (
            <button
              type="button"
              onClick={handleResetSearch}
              className="mt-2 rounded-full border border-white/30 px-10 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-200 transition-colors hover:bg-white/10"
            >
              {t("cvs.projectsPage.search.reset")}
            </button>
          ) : null}
        </>
      )}
    </div>
  );

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<ProjectModalMode>("add");
  const [projectModalInitialValues, setProjectModalInitialValues] = useState<AddProjectFormInitialProject | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectPendingDelete, setProjectPendingDelete] = useState<CvProject | null>(null);

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

    await removeCvProject({ projectId });
    handleCloseDeleteModal();
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
          menuWidth="155px"
          buttonClassName="text-white hover:bg-white/10"
          iconClassName="w-5 h-5 text-white"
        />
      );
    },
  });

  const tableProps: TableProps<CvProject> = {
    data: sortedProjects,
    columns,
    keyExtractor: (row) => row.id,
    emptyState,
    mobileSummaryKeys: ["name", "end_date"],
  };

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
    deleteProjectModal: {
      open: isDeleteModalOpen,
      onClose: handleCloseDeleteModal,
      onConfirm: handleConfirmDeleteProject,
      projectName: projectPendingDelete?.name,
      isLoading: isRemoveProjectLoading,
      errorMessage: removeProjectError?.message ?? null,
    },
  };
}
