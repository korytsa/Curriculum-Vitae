"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddCvProject, useCv, useRemoveCvProject, useUpdateCvProject } from "@/features/cvs";
import { useProjects } from "@/features/projects";
import type { CvProject, Project } from "@/shared/graphql/generated";
import { Loader, type SearchInputProps, type TableProps, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { createCvProjectsColumns } from "../config/constants";
import type {
  AddProjectFormInitialProject,
  AddProjectModalSubmitPayload,
  CvProjectsActiveField,
  CvProjectsDirection,
  ProjectModalMode,
  ProjectSearchState,
  UseCvProjectsPageParams,
  UseCvProjectsPageResult,
} from "../types";

const useProjectSearchState = (projects: CvProject[], placeholder: string): ProjectSearchState => {
  const [searchResults, setSearchResults] = useState<CvProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const filteredProjects = hasSearchQuery ? searchResults : projects;

  const handleResetSearch = () => {
    setSearchResetKey((prev) => prev + 1);
    setSearchResults([]);
    setSearchQuery("");
  };

  const searchInputProps: SearchInputProps<CvProject> = {
    data: projects,
    fields: ["project.name"],
    onResults: setSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: hasSearchQuery && filteredProjects.length === 0,
    placeholder,
  };

  return {
    searchInputProps,
    filteredProjects,
    hasSearchQuery,
    handleResetSearch,
  };
};

const parseDateToTimestamp = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getComparableValue = (project: CvProject, field: CvProjectsActiveField): string | number | null => {
  switch (field) {
    case "name":
      return (project.name ?? project.project?.name ?? "").toLowerCase();
    case "domain":
      return (project.domain ?? "").toLowerCase();
    case "start_date":
      return parseDateToTimestamp(project.start_date);
    case "end_date":
      return parseDateToTimestamp(project.end_date);
    default:
      return null;
  }
};

const sortProjects = (projects: CvProject[], field: CvProjectsActiveField | null, direction: CvProjectsDirection) => {
  if (!field) {
    return projects;
  }

  const multiplier = direction === "asc" ? 1 : -1;

  return [...projects].sort((projectA, projectB) => {
    const valueA = getComparableValue(projectA, field);
    const valueB = getComparableValue(projectB, field);
    let comparison = 0;

    if (valueA == null && valueB == null) {
      comparison = 0;
    } else if (valueA == null) {
      comparison = 1;
    } else if (valueB == null) {
      comparison = -1;
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      comparison = valueA === valueB ? 0 : valueA > valueB ? 1 : -1;
    } else {
      comparison = String(valueA).localeCompare(String(valueB));
    }

    return comparison * multiplier;
  });
};

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

  const formatDate = (value?: string | null) => {
    if (!value) {
      return t("cvs.projectsPage.table.labels.present");
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const formatter = new Intl.DateTimeFormat(dateTimeLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    return formatter.format(date);
  };

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
    formatDate,
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
