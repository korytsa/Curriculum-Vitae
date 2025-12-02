"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CvProject } from "@/shared/graphql/generated";
import { Loader, type TableProps, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { createProjectsTableColumns, formatDate, sortProjects, useProjectSearchState, DEFAULT_SORT_DIRECTION } from "../index";
import type { ProjectsActiveField, ProjectsDirection } from "./types";

export type UseProjectsTableParams = {
  projects: CvProject[];
  locale: string;
  isLoading?: boolean;
  onEdit: (project: CvProject) => void;
  onDelete: (project: CvProject) => void;
  tableConfig?: {
    menuWidth?: string;
    buttonClassName?: string;
    iconClassName?: string;
    mobileSummaryKeys?: string[];
  };
  emptyStateConfig?: {
    showTitle?: boolean;
    emptyTitleKey?: string;
    noResultsTitleKey?: string;
  };
};

export function useProjectsTable({
  projects,
  locale,
  isLoading = false,
  onEdit,
  onDelete,
  tableConfig = {},
  emptyStateConfig = {},
}: UseProjectsTableParams) {
  const { t } = useTranslation();
  const [{ field: activeField, direction }, setSortState] = useState<{
    field: ProjectsActiveField | null;
    direction: ProjectsDirection;
  }>({
    field: null,
    direction: DEFAULT_SORT_DIRECTION,
  });

  const toggleField = (field: ProjectsActiveField) => {
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

  const searchPlaceholder = t("cvs.projectsPage.search.placeholder");
  const dateTimeLocale = locale && Intl.DateTimeFormat.supportedLocalesOf([locale]).length ? locale : undefined;

  const { searchInputProps, filteredProjects, hasSearchQuery, handleResetSearch } = useProjectSearchState(projects, searchPlaceholder);
  const sortedProjects = sortProjects(filteredProjects, activeField, direction);

  const formatDateValue = (value?: string | null) => formatDate(value, dateTimeLocale, t("cvs.projectsPage.table.labels.present"));

  const {
    menuWidth = "155px",
    buttonClassName = "text-white hover:bg-white/10",
    iconClassName = "w-5 h-5 text-white",
    mobileSummaryKeys = ["name", "end_date"],
  } = tableConfig;

  const {
    showTitle = true,
    emptyTitleKey = "cvs.projectsPage.states.empty.title",
    noResultsTitleKey = "cvs.projectsPage.states.noResults.title",
  } = emptyStateConfig;

  const emptyState = isLoading ? (
    <Loader className="mx-auto mt-6" />
  ) : (
    <div className={`mt-6 flex flex-col items-center justify-center gap-3 text-center ${!showTitle ? "py-20" : ""}`}>
      {showTitle ? (
        <>
          <h3 className="text-xl text-white">{hasSearchQuery ? t(noResultsTitleKey) : t(emptyTitleKey)}</h3>
          {hasSearchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="mt-2 rounded-full border border-white/30 px-10 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-200 transition-colors hover:bg-white/10"
            >
              {t("cvs.projectsPage.search.reset")}
            </button>
          )}
        </>
      ) : hasSearchQuery ? (
        <button
          type="button"
          onClick={handleResetSearch}
          className="mt-2 rounded-full border border-white/30 px-10 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-200 transition-colors hover:bg-white/10"
        >
          {t("cvs.projectsPage.search.reset")}
        </button>
      ) : null}
    </div>
  );

  const columns = createProjectsTableColumns({
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
          onClick: () => onEdit(row),
        },
        {
          label: t("cvs.projectsPage.actions.remove"),
          onClick: () => onDelete(row),
        },
      ];

      return (
        <TableRowActions
          items={menuItems}
          ariaLabel={t("cvs.projectsPage.actions.openMenu")}
          menuWidth={menuWidth}
          buttonClassName={buttonClassName}
          iconClassName={iconClassName}
        />
      );
    },
  });

  const tableProps: TableProps<CvProject> = {
    data: sortedProjects,
    columns,
    keyExtractor: (row) => row.id,
    emptyState,
    mobileSummaryKeys: [...mobileSummaryKeys],
  };

  return {
    searchInputProps,
    tableProps,
  };
}

