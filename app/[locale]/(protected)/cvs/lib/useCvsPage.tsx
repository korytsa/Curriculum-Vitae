import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, type SearchInputProps, type TableProps, TableRowActions, type DropdownMenuItem } from "@/shared/ui";
import { useCvs, type CvListItem } from "@/features/cvs";
import { CVS_SEARCH_FIELDS, createCvsTableColumns } from "../config/constants";

type SortDirection = "asc" | "desc" | null;

interface UseCvsPageResult {
  heading: string;
  searchInputProps: SearchInputProps<CvListItem>;
  tableProps: TableProps<CvListItem>;
  refetch: () => Promise<unknown>;
  onDetails?: (cvId: string) => void;
  onDelete?: (cvId: string) => void;
}

export function useCvsPage(options?: { onDetails?: (cvId: string) => void; onDelete?: (cvId: string) => void }): UseCvsPageResult {
  const { t } = useTranslation();
  const { cvs, loading, refetch } = useCvs();
  const [filteredCvs, setFilteredCvs] = useState<CvListItem[]>(cvs);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    setFilteredCvs(cvs);
  }, [cvs]);

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === "asc") return "desc";
      if (prev === "desc") return "asc";
      return "asc";
    });
  };

  const sortedCvs =
    sortDirection == null
      ? filteredCvs
      : [...filteredCvs].sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          if (sortDirection === "asc") {
            return aName.localeCompare(bName);
          }
          return bName.localeCompare(aName);
        });

  const handleSearchResults = (results: CvListItem[]) => {
    setFilteredCvs(results);
  };

  const handleResetSearch = () => {
    setSearchResetKey((prev) => prev + 1);
    setFilteredCvs(cvs);
    setSearchQuery("");
  };

  const isSearchActive = searchQuery.trim().length > 0;

  const emptyState = isSearchActive ? (
    <div className="py-10 text-center space-y-3 text-white/80">
      <p>{t("cvs.states.searchEmpty")}</p>
      <Button type="button" variant="outline" size="sm" onClick={handleResetSearch} className="border-white/30 text-white/80 hover:bg-white/10">
        {t("cvs.states.reset")}
      </Button>
    </div>
  ) : (
    <div className="py-10 text-center text-white/70">{t("cvs.states.empty")}</div>
  );

  const searchInputProps: SearchInputProps<CvListItem> = {
    data: cvs,
    fields: [...CVS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && filteredCvs.length === 0,
    placeholder: t("cvs.table.searchPlaceholder"),
  };

  const renderRowActions = (row: CvListItem) => {
    const labelTarget = row.name || row.id;

    const menuItems: DropdownMenuItem[] = [
      {
        label: t("cvs.actions.details"),
        onClick: () => options?.onDetails?.(row.id),
      },
      {
        label: t("cvs.actions.delete"),
        onClick: () => options?.onDelete?.(row.id),
      },
    ];

    return <TableRowActions items={menuItems} ariaLabel={`Open actions for ${labelTarget}`} menuWidth="120px" />;
  };

  const nameColumnLabel = t("cvs.list.columns.name");
  const educationColumnLabel = t("cvs.list.columns.education");
  const employeeColumnLabel = t("cvs.list.columns.employee");
  const emptyValueLabel = t("cvs.list.columns.emptyValue");

  const cvsTableColumns = createCvsTableColumns({
    name: nameColumnLabel,
    education: educationColumnLabel,
    employee: employeeColumnLabel,
    emptyValue: emptyValueLabel,
  });

  const tableProps: TableProps<CvListItem> = {
    data: sortedCvs,
    columns: cvsTableColumns.map((col) => {
      if (col.key === "name") {
        return {
          ...col,
          header: (
            <Button type="button" variant="ghost" onClick={handleSort} className="flex items-center gap-2 hover:opacity-80 transition-opacity h-auto p-0 border-none text-white">
              <span className="normal-case">{nameColumnLabel}</span>
              <span className="text-xs text-white/50">{sortDirection === "asc" ? " ↑" : sortDirection === "desc" ? " ↓" : " ↑"}</span>
            </Button>
          ),
        };
      }
      return col;
    }),
    loading,
    keyExtractor: (row) => row.id,
    emptyState,
    renderActions: renderRowActions,
    mobileSummaryKeys: ["name", "employee"],
  };

  return {
    heading: t("cvs.heading") || "CVs",
    searchInputProps,
    tableProps,
    refetch,
    onDetails: options?.onDetails,
    onDelete: options?.onDelete,
  };
}
