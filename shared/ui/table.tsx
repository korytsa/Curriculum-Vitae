import * as React from "react";
import { cn } from "@/shared/lib";
import { Skeleton } from "./skeleton";
import {
  createSkeletonArray,
  getTableCellContent,
  resolveTableRowKey,
} from "./utils";

const MOBILE_SUMMARY_COLUMN_KEYS = new Set([
  "avatar",
  "first_name",
  "department_name",
]);

export interface TableColumn<T> {
  key: keyof T | string;
  header: string | React.ReactNode;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
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
}: TableProps<T>) {
  const skeletonRowIndices = createSkeletonArray(skeletonRows);

  const mobileColumnMap = React.useMemo(() => {
    const map = new Map<string, TableColumn<T>>();
    columns.forEach((column) => {
      const key = String(column.key);
      if (MOBILE_SUMMARY_COLUMN_KEYS.has(key)) {
        map.set(key, column);
      }
    });
    return map;
  }, [columns]);

  const defaultEmptyState = (
    <span className="text-sm text-neutral-500">No data available</span>
  );

  const emptyStateContent = emptyState || defaultEmptyState;

  const renderMobileRow = (row: T, index: number) => {
    const key = resolveTableRowKey(row, index, keyExtractor);
    const avatarColumn = mobileColumnMap.get("avatar");
    const firstNameColumn = mobileColumnMap.get("first_name");
    const departmentColumn = mobileColumnMap.get("department_name");

    return (
      <div key={key} className="px-4 py-3 border-b border-white/15">
        <div className="flex items-center gap-4">
          {avatarColumn && (
            <div className="flex-shrink-0">
              {getTableCellContent(avatarColumn, row)}
            </div>
          )}
          <div className="flex-1 flex items-center justify-between min-w-0">
            {firstNameColumn && (
              <div className="text-white/80 text-sm font-medium truncate">
                {getTableCellContent(firstNameColumn, row)}
              </div>
            )}
            {departmentColumn && (
              <div className="text-white/80 text-sm ml-4 flex-shrink-0">
                {getTableCellContent(departmentColumn, row)}
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
      <div className={cn("w-full overflow-x-auto hidden md:block", className)}>
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

      <div className={cn("w-full md:hidden", className)}>
        <div className="flex items-center gap-4 px-4 py-3 border-b border-white/15 mb-2">
          <div className="flex-1 flex">
            <span className="text-sm font-bold text-white">First Name</span>
            <div className="flex-1"></div>
            <span className="text-sm font-bold text-white">Department</span>
          </div>
          {renderActions && <div className="w-10"></div>}
        </div>

        <div>
          {loading ? (
            skeletonRowIndices.map((index) => (
              <div
                key={`skeleton-mobile-${index}`}
                className="px-4 py-3 border-b border-white/15"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
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
    </>
  );
}
