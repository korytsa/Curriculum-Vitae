import * as React from "react";
import { cn } from "@/shared/lib";
import { Skeleton } from "./skeleton";
import {
  createSkeletonArray,
  getTableCellContent,
  resolveTableRowKey,
} from "./utils";

const DEFAULT_MOBILE_SUMMARY_KEYS = [
  "avatar",
  "first_name",
  "department_name",
] as const;

export interface TableColumn<T> {
  key: keyof T | string;
  header: string | React.ReactNode;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  mobileHeaderLabel?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
  keyExtractor?: (row: T) => string | number;
  className?: string;
  emptyState?: React.ReactNode;
  loading?: boolean;
  skeletonRows?: number;
  mobileSummaryKeys?: Array<keyof T | string>;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  renderActions,
  keyExtractor,
  className,
  emptyState,
  loading = false,
  skeletonRows = 8,
  mobileSummaryKeys,
}: TableProps<T>) {
  const skeletonRowIndices = createSkeletonArray(skeletonRows);

  const mobileSummaryConfig = React.useMemo(() => {
    const keysToUse =
      mobileSummaryKeys && mobileSummaryKeys.length > 0
        ? mobileSummaryKeys.map((key) => String(key))
        : Array.from(DEFAULT_MOBILE_SUMMARY_KEYS);

    const columnsByKey = new Map(
      columns.map((column) => [String(column.key), column])
    );

    const summaryColumns = keysToUse
      .map((key) => columnsByKey.get(key))
      .filter((column): column is TableColumn<T> => Boolean(column));

    const avatarColumn =
      summaryColumns.find((column) => String(column.key) === "avatar") ?? null;
    const textColumns = summaryColumns.filter(
      (column) => String(column.key) !== "avatar"
    );

    return {
      avatarColumn,
      primaryColumn: textColumns[0] ?? null,
      secondaryColumn: textColumns[1] ?? null,
      hasSummary: summaryColumns.length > 0,
    };
  }, [columns, mobileSummaryKeys]);

  const {
    avatarColumn,
    primaryColumn,
    secondaryColumn,
    hasSummary: hasMobileSummary,
  } = mobileSummaryConfig;

  const getMobileHeaderLabel = (column?: TableColumn<T> | null) => {
    if (!column) return "";
    if (column.mobileHeaderLabel) return column.mobileHeaderLabel;
    if (typeof column.header === "string") return column.header;
    return "";
  };

  const defaultEmptyState = (
    <span className="text-sm text-neutral-500">No data available</span>
  );

  const emptyStateContent = emptyState || defaultEmptyState;

  const renderMobileRow = (row: T, index: number) => {
    const key = resolveTableRowKey(row, index, keyExtractor);

    return (
      <div key={key} className="px-4 py-3 border-b border-white/15">
        <div className="flex items-center gap-4">
          {avatarColumn && (
            <div className="flex-shrink-0">
              {getTableCellContent(avatarColumn, row)}
            </div>
          )}
          <div className="flex-1 flex items-center justify-between min-w-0 gap-4">
            {primaryColumn && (
              <div className="text-white/80 text-sm font-medium truncate flex-1">
                {getTableCellContent(primaryColumn, row)}
              </div>
            )}
            {secondaryColumn && (
              <div className="text-white/80 text-sm text-right flex-shrink-0">
                {getTableCellContent(secondaryColumn, row)}
              </div>
            )}
          </div>
          {renderActions && (
            <div className="flex-shrink-0">{renderActions(row)}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "w-full overflow-x-auto",
          hasMobileSummary ? "hidden md:block" : "",
          className
        )}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/15">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-4 text-left text-sm font-bold text-white",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
              {renderActions && (
                <th className="px-4 py-4 text-left text-sm font-bold text-white/80" />
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRowIndices.map((index) => (
                <tr
                  key={`skeleton-${index}`}
                  className="border-b border-white/15"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn("px-4 py-4", column.className)}
                    >
                      {column.key === "avatar" ? (
                        <Skeleton className="h-10 w-10 rounded-full" />
                      ) : (
                        <Skeleton className="h-5 w-full" />
                      )}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-5 rounded" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-4 py-8 text-center"
                >
                  {emptyStateContent}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = resolveTableRowKey(row, index, keyExtractor);
                const description = (row as { description?: string | null })
                  .description;
                const hasDescription = Boolean(description?.trim());
                const descriptionColSpan = columns.length;
                return (
                  <React.Fragment key={key}>
                    <tr>
                      {columns.map((column) => {
                        const cellContent = getTableCellContent(column, row);
                        return (
                          <td
                            key={String(column.key)}
                            className={cn(
                              "px-4 py-4 text-sm text-white",
                              column.className
                            )}
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                      {renderActions && (
                        <td
                          className="px-4 py-4"
                          rowSpan={hasDescription ? 2 : 1}
                        >
                          <div className="flex items-center justify-center">
                            {renderActions(row)}
                          </div>
                        </td>
                      )}
                    </tr>
                    {hasDescription && (
                      <tr>
                        <td
                          colSpan={descriptionColSpan}
                          className="px-4 py-2 text-sm text-white/70 "
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {description}
                        </td>
                        {renderActions && <td />}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {hasMobileSummary && (
        <div className={cn("w-full md:hidden", className)}>
          {(primaryColumn || secondaryColumn) && (
            <div className="flex items-center gap-4 px-4 py-3 border-b border-white/15 mb-2">
              {avatarColumn && <div className="w-10" />}
              <div className="flex-1 flex items-center">
                {primaryColumn && (
                  <span className="text-sm font-bold text-white">
                    {getMobileHeaderLabel(primaryColumn)}
                  </span>
                )}
                <div className="flex-1" />
                {secondaryColumn && (
                  <span className="text-sm font-bold text-white">
                    {getMobileHeaderLabel(secondaryColumn)}
                  </span>
                )}
              </div>
              {renderActions && <div className="w-10" />}
            </div>
          )}

          <div>
            {loading ? (
              skeletonRowIndices.map((index) => (
                <div
                  key={`skeleton-mobile-${index}`}
                  className="px-4 py-3 border-b border-white/15"
                >
                  <div className="flex items-center gap-4">
                    {avatarColumn ? (
                      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    ) : null}
                    <div className="flex-1 flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      {secondaryColumn && <Skeleton className="h-4 w-24" />}
                    </div>
                    {renderActions && (
                      <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            ) : data.length === 0 ? (
              <div className="px-4 py-8 text-center">{emptyStateContent}</div>
            ) : (
              data.map((row, index) => renderMobileRow(row, index))
            )}
          </div>
        </div>
      )}
    </>
  );
}
