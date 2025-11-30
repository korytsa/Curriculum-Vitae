import type { ReactNode } from "react";
import { MdArrowDownward } from "react-icons/md";

import type { CvProject } from "@/shared/graphql/generated";
import type { TableColumn } from "@/shared/ui";

export type TranslateFn = (key: string) => string;

export const CV_PROJECTS_SEARCH_FIELDS = [
  "name",
  "internal_name",
  "project.name",
  "project.internal_name",
  "domain",
  "description",
  "roles",
  "responsibilities",
  "environment",
] as const;

export const CV_PROJECTS_SEARCH_FIELDS_LIST: string[] = [...CV_PROJECTS_SEARCH_FIELDS];

export type CvProjectsSearchField = (typeof CV_PROJECTS_SEARCH_FIELDS)[number];

export type CvProjectsActiveField = "name" | "domain" | "start_date" | "end_date";

export type CvProjectsDirection = "asc" | "desc";

export type ProjectModalMode = "add" | "update";

type CreateCvProjectsColumnsParams = {
  labels: {
    name: string;
    domain: string;
    startDate: string;
    endDate: string;
    actions: string;
    nameSortAria: string;
    domainSortAria: string;
    startDateSortAria: string;
    endDateSortAria: string;
  };
  formatDate: (value?: string | null) => string;
  onToggleName: () => void;
  onToggleDomain: () => void;
  onToggleStartDate: () => void;
  onToggleEndDate: () => void;
  activeField: CvProjectsActiveField | null;
  direction: CvProjectsDirection;
  renderRowActions?: (row: CvProject) => ReactNode;
};

const SortIcon = ({ direction }: { direction: CvProjectsDirection }) => {
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
  direction: CvProjectsDirection;
}) => {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="group inline-flex items-center gap-2">
      <span>{label}</span>
      <div className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <SortIcon direction={isActive ? direction : "desc"} />
      </div>
    </button>
  );
};

const renderNameCell = (row: CvProject): ReactNode => {
  return <span className="text-base font-semibold text-white">{row.name}</span>;
};

const renderTextCell = (value: unknown) => <span className="text-white/80">{String(value ?? "")}</span>;

const formatDateValue = (value: unknown, formatDate: CreateCvProjectsColumnsParams["formatDate"]) => formatDate(typeof value === "string" ? value : undefined);

const buildDateColumnConfig = (
  key: Extract<CvProjectsActiveField, "start_date" | "end_date">,
  label: string,
  ariaLabel: string,
  onToggle: () => void,
  formatDate: CreateCvProjectsColumnsParams["formatDate"]
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

type SortableColumnConfig = {
  key: CvProjectsActiveField;
  label: string;
  ariaLabel: string;
  onToggle: () => void;
  className?: string;
  render: TableColumn<CvProject>["render"];
};

export const buildCvProjectsColumnLabels = (translate: TranslateFn) => ({
  name: translate("cvs.projectsPage.table.columns.name"),
  domain: translate("cvs.projectsPage.table.columns.domain"),
  startDate: translate("cvs.projectsPage.table.columns.startDate"),
  endDate: translate("cvs.projectsPage.table.columns.endDate"),
  actions: translate("cvs.projectsPage.table.columns.actions"),
  nameSortAria: translate("cvs.projectsPage.table.sort.name"),
  domainSortAria: translate("cvs.projectsPage.table.sort.domain"),
  startDateSortAria: translate("cvs.projectsPage.table.sort.startDate"),
  endDateSortAria: translate("cvs.projectsPage.table.sort.endDate"),
});

export const createCvProjectsColumns = ({
  labels,
  formatDate,
  onToggleName,
  onToggleDomain,
  onToggleStartDate,
  onToggleEndDate,
  activeField,
  direction,
  renderRowActions,
}: CreateCvProjectsColumnsParams): TableColumn<CvProject>[] => {
  const columnsConfig: SortableColumnConfig[] = [
    {
      key: "name",
      label: labels.name,
      ariaLabel: labels.nameSortAria,
      onToggle: onToggleName,
      render: (_value: unknown, row: CvProject) => renderNameCell(row),
    },
    {
      key: "domain",
      label: labels.domain,
      ariaLabel: labels.domainSortAria,
      onToggle: onToggleDomain,
      render: (value: unknown) => renderTextCell(value),
    },
    buildDateColumnConfig("start_date", labels.startDate, labels.startDateSortAria, onToggleStartDate, formatDate),
    buildDateColumnConfig("end_date", labels.endDate, labels.endDateSortAria, onToggleEndDate, formatDate),
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
      header: <span className="sr-only">{labels.actions}</span>,
      mobileHeaderLabel: labels.actions,
      className: "w-0 text-right",
      render: (_value: unknown, row: CvProject) => <div className="flex w-full justify-end">{renderRowActions(row)}</div>,
    });
  }

  return sortableColumns;
};

export const buildAddProjectModalLabels = (translate: TranslateFn) => ({
  project: translate("cvs.projectsPage.modal.fields.project"),
  domain: translate("cvs.projectsPage.modal.fields.domain"),
  startDate: translate("cvs.projectsPage.modal.fields.startDate"),
  endDate: translate("cvs.projectsPage.modal.fields.endDate"),
  description: translate("cvs.projectsPage.modal.fields.description"),
  environment: translate("cvs.projectsPage.modal.fields.environment"),
  responsibilities: translate("cvs.projectsPage.modal.fields.responsibilities"),
  responsibilitiesPlaceholder: translate("cvs.projectsPage.modal.fields.responsibilitiesPlaceholder"),
});

export const buildAddProjectModalActions = (translate: TranslateFn, mode: ProjectModalMode) => ({
  cancel: translate("cvs.projectsPage.modal.actions.cancel"),
  submit: mode === "update" ? translate("cvs.projectsPage.modal.actions.update") : translate("cvs.projectsPage.modal.actions.submit"),
});

export const getAddProjectModalTitle = (translate: TranslateFn, mode: ProjectModalMode) =>
  mode === "update" ? translate("cvs.projectsPage.modal.updateTitle") : translate("cvs.projectsPage.modal.title");

export const buildProjectRowActionsLabels = (translate: TranslateFn) => ({
  update: translate("cvs.projectsPage.actions.update"),
  remove: translate("cvs.projectsPage.actions.remove"),
  openMenu: translate("cvs.projectsPage.actions.openMenu"),
});
