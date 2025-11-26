import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, type SearchInputProps, type TableProps } from "@/shared/ui";
import { useCvs, type CvListItem } from "@/features/cvs";
import { CVS_SEARCH_FIELDS, CVS_TABLE_COLUMNS } from "../config/constants";
import { CvRowActions } from "../components/CvRowActions";

type SortDirection = "asc" | "desc" | null;

interface UseCvsPageResult {
  heading: string;
  searchInputProps: SearchInputProps<CvListItem>;
  tableProps: TableProps<CvListItem>;
  refetch: () => Promise<unknown>;
  onDetails?: (cvId: string) => void;
  onDelete?: (cvId: string) => void;
}

export function useCvsPage(options?: {
  onDetails?: (cvId: string) => void;
  onDelete?: (cvId: string) => void;
}): UseCvsPageResult {
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

  const sortedCvs = useMemo(() => {
    if (!sortDirection) return filteredCvs;

    return [...filteredCvs].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (sortDirection === "asc") {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    });
  }, [filteredCvs, sortDirection]);

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
      <p>{t("cvs.states.searchEmpty", { defaultValue: "No CVs found." })}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleResetSearch}
        className="border-white/30 text-white/80 hover:bg-white/10"
      >
        {t("cvs.states.reset", { defaultValue: "Reset search" })}
      </Button>
    </div>
  ) : (
    <div className="py-10 text-center text-white/70">
      {t("cvs.states.empty", { defaultValue: "No CVs added yet." })}
    </div>
  );

  const searchInputProps: SearchInputProps<CvListItem> = {
    data: cvs,
    fields: [...CVS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && filteredCvs.length === 0,
    placeholder: t("cvs.table.searchPlaceholder", {
      defaultValue: "Search CVs",
    }),
  };

  const renderRowActions = (row: CvListItem) => (
    <CvRowActions
      row={row}
      onDetails={options?.onDetails}
      onDelete={options?.onDelete}
    />
  );

  const tableProps: TableProps<CvListItem> = {
    data: sortedCvs,
    columns: CVS_TABLE_COLUMNS.map((col) => {
      if (col.key === "name") {
        return {
          ...col,
          header: (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSort}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity h-auto p-0 border-none text-white"
            >
              <span>Name</span>
              <span className="text-xs text-white/50">
                {sortDirection === "asc"
                  ? " ↑"
                  : sortDirection === "desc"
                    ? " ↓"
                    : " ↑"}
              </span>
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
