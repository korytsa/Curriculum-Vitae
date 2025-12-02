import type { ReactNode } from "react";
import { MdArrowDownward } from "react-icons/md";

import type { CvProject } from "@/shared/graphql/generated";
import type { TableColumn } from "@/shared/ui";
import type { ProjectsActiveField, ProjectsDirection } from "./types";
import { DEFAULT_SORT_DIRECTION } from "./constants";

export type SortableColumnConfig = {
  key: ProjectsActiveField;
  label: string;
  ariaLabel: string;
  onToggle: () => void;
  className?: string;
  render: TableColumn<CvProject>["render"];
};

const SortIcon = ({ direction }: { direction: ProjectsDirection }) => {
  return <MdArrowDownward className={`h-4 w-4 transition-transform duration-300 ${direction === "asc" ? "rotate-180" : "rotate-0"}`} />;
};

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
}) => {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="group inline-flex items-center gap-2">
      <span>{label}</span>
      <div className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <SortIcon direction={isActive ? direction : DEFAULT_SORT_DIRECTION} />
      </div>
    </button>
  );
};

const renderNameCell = (row: CvProject): ReactNode => {
  return <span className="text-base font-semibold text-white">{row.name}</span>;
};

const renderTextCell = (value: unknown) => <span className="text-white/80">{String(value ?? "")}</span>;

const formatDateValue = (value: unknown, formatDate: (value?: string | null) => string) => formatDate(typeof value === "string" ? value : undefined);

const buildDateColumnConfig = (
  key: Extract<ProjectsActiveField, "start_date" | "end_date">,
  label: string,
  ariaLabel: string,
  onToggle: () => void,
  formatDate: (value?: string | null) => string
): SortableColumnConfig => {
  return {
    key,
    label,
    ariaLabel,
    onToggle,
    className: "whitespace-nowrap",
    render: (value: unknown) => renderTextCell(formatDateValue(value, formatDate)),
  };
};

export const createProjectsTableColumns = ({
  t,
  formatDate,
  onToggleName,
  onToggleDomain,
  onToggleStartDate,
  onToggleEndDate,
  activeField,
  direction,
  renderRowActions,
}: {
  t: (key: string) => string;
  formatDate: (value?: string | null) => string;
  onToggleName: () => void;
  onToggleDomain: () => void;
  onToggleStartDate: () => void;
  onToggleEndDate: () => void;
  activeField: ProjectsActiveField | null;
  direction: ProjectsDirection;
  renderRowActions?: (row: CvProject) => ReactNode;
}): TableColumn<CvProject>[] => {
  const columnsConfig: SortableColumnConfig[] = [
    {
      key: "name",
      label: t("cvs.projectsPage.table.columns.name"),
      ariaLabel: t("cvs.projectsPage.table.sort.name"),
      onToggle: onToggleName,
      render: (_value: unknown, row: CvProject) => renderNameCell(row),
    },
    {
      key: "domain",
      label: t("cvs.projectsPage.table.columns.domain"),
      ariaLabel: t("cvs.projectsPage.table.sort.domain"),
      onToggle: onToggleDomain,
      render: (value: unknown) => renderTextCell(value),
    },
    buildDateColumnConfig("start_date", t("cvs.projectsPage.table.columns.startDate"), t("cvs.projectsPage.table.sort.startDate"), onToggleStartDate, formatDate),
    buildDateColumnConfig("end_date", t("cvs.projectsPage.table.columns.endDate"), t("cvs.projectsPage.table.sort.endDate"), onToggleEndDate, formatDate),
  ];

  const sortableColumns: TableColumn<CvProject>[] = columnsConfig.map(({ key, label, ariaLabel, onToggle, render, className }) => ({
    key,
    header: <SortableHeaderButton label={label} ariaLabel={ariaLabel} onClick={onToggle} isActive={activeField === key} direction={direction} />,
    mobileHeaderLabel: label,
    className,
    render,
  }));

  if (renderRowActions) {
    sortableColumns.push({
      key: "actions",
      header: <span className="sr-only">{t("cvs.projectsPage.table.columns.actions")}</span>,
      mobileHeaderLabel: t("cvs.projectsPage.table.columns.actions"),
      className: "w-0 text-right",
      render: (_value: unknown, row: CvProject) => <div className="flex w-full justify-end">{renderRowActions(row)}</div>,
    });
  }

  return sortableColumns;
};

