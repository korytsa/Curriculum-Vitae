"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowDownward } from "react-icons/md";
import type { CvProject } from "@/shared/graphql/generated";
import { Loader, type TableProps, type TableColumn, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { formatDate, sortProjects, useProjectSearchState, useProjectsPermissions } from "./utils";
import { DEFAULT_SORT_DIRECTION } from "./constants";
import type { ProjectsActiveField, ProjectsDirection, UseProjectsTableParams } from "./types";

const SortIcon = ({ direction }: { direction: ProjectsDirection }) => (
  <MdArrowDownward className={`h-4 w-4 transition-transform duration-300 ${direction === "asc" ? "rotate-180" : "rotate-0"}`} />
);

const SortableHeaderButton = ({
  label,
  ariaLabel,
  onClick,
  isActive,
  direction,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  isActive: boolean;
  direction: ProjectsDirection;
}) => (
  <button type="button" onClick={onClick} aria-label={ariaLabel} className="group inline-flex items-center gap-2">
    <span>{label}</span>
    <div className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
      <SortIcon direction={isActive ? direction : DEFAULT_SORT_DIRECTION} />
    </div>
  </button>
);

const renderNameCell = (row: CvProject): ReactNode => <span className="text-base font-semibold text-white">{row.name}</span>;

const renderTextCell = (value: unknown) => <span className="text-white/80">{String(value ?? "")}</span>;

const formatDateCell = (value: unknown, formatDateFn: (value?: string | null) => string) => renderTextCell(formatDateFn(typeof value === "string" ? value : undefined));

export function useProjectsTable({ projects, locale, isLoading = false, onEdit, onDelete, tableConfig = {}, emptyStateConfig = {} }: UseProjectsTableParams) {
  const { t } = useTranslation();
  const { canManageProjects } = useProjectsPermissions();

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

  const { menuWidth = "155px", buttonClassName = "text-white hover:bg-white/10", iconClassName = "w-5 h-5 text-white", mobileSummaryKeys = ["name", "end_date"] } = tableConfig;

  const { showTitle = true, emptyTitleKey = "cvs.projectsPage.states.empty.title", noResultsTitleKey = "cvs.projectsPage.states.noResults.title" } = emptyStateConfig;

  const resetButton = (
    <button
      type="button"
      onClick={handleResetSearch}
      className="mt-2 rounded-full border border-white/30 px-10 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-200 transition-colors hover:bg-white/10"
    >
      {t("cvs.projectsPage.search.reset")}
    </button>
  );

  const emptyState = isLoading ? (
    <Loader className="mx-auto mt-6" />
  ) : (
    <div className={`mt-6 flex flex-col items-center justify-center gap-3 text-center ${!showTitle ? "py-20" : ""}`}>
      {showTitle && <h3 className="text-xl text-white">{hasSearchQuery ? t(noResultsTitleKey) : t(emptyTitleKey)}</h3>}
      {hasSearchQuery && resetButton}
    </div>
  );

  const createSortableColumn = (
    key: ProjectsActiveField,
    labelKey: string,
    ariaLabelKey: string,
    onToggle: () => void,
    render: (value: unknown, row: CvProject) => ReactNode,
    className?: string
  ): TableColumn<CvProject> => ({
    key,
    header: <SortableHeaderButton label={t(labelKey)} ariaLabel={t(ariaLabelKey)} onClick={onToggle} isActive={activeField === key} direction={direction} />,
    mobileHeaderLabel: t(labelKey),
    className,
    render,
  });

  const renderRowActions = (row: CvProject) => {
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
      <TableRowActions items={menuItems} ariaLabel={t("cvs.projectsPage.actions.openMenu")} menuWidth={menuWidth} buttonClassName={buttonClassName} iconClassName={iconClassName} />
    );
  };

  const columns: TableColumn<CvProject>[] = [
    createSortableColumn(
      "name",
      "cvs.projectsPage.table.columns.name",
      "cvs.projectsPage.table.sort.name",
      () => toggleField("name"),
      (_value, row) => renderNameCell(row)
    ),
    createSortableColumn(
      "domain",
      "cvs.projectsPage.table.columns.domain",
      "cvs.projectsPage.table.sort.domain",
      () => toggleField("domain"),
      (value) => renderTextCell(value)
    ),
    createSortableColumn(
      "start_date",
      "cvs.projectsPage.table.columns.startDate",
      "cvs.projectsPage.table.sort.startDate",
      () => toggleField("start_date"),
      (value) => formatDateCell(value, formatDateValue),
      "whitespace-nowrap"
    ),
    createSortableColumn(
      "end_date",
      "cvs.projectsPage.table.columns.endDate",
      "cvs.projectsPage.table.sort.endDate",
      () => toggleField("end_date"),
      (value) => formatDateCell(value, formatDateValue),
      "whitespace-nowrap"
    ),
    ...(canManageProjects
      ? [
          {
            key: "actions",
            header: <span className="sr-only">{t("cvs.projectsPage.table.columns.actions")}</span>,
            mobileHeaderLabel: t("cvs.projectsPage.table.columns.actions"),
            className: "w-0 text-right",
            render: (_value: unknown, row: CvProject) => <div className="flex w-full justify-end">{renderRowActions(row)}</div>,
          },
        ]
      : []),
  ];

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
