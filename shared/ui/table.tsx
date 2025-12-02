import * as React from "react";
import { cn } from "@/shared/lib";
import { Skeleton } from "./skeleton";
import { createSkeletonArray, getTableCellContent, resolveTableRowKey, getMobileHeaderLabel, buildMobileSummaryConfig } from "./utils/table";

const DEFAULT_MOBILE_SUMMARY_KEYS = ["avatar", "first_name", "department_name"] as const;

const BORDER_CLASS = "border-b border-white/15";

type ExtendedRowData = {
  description?: string | null;
  responsibilities?: string[] | null;
  environment?: string[] | null;
};

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
  showRowBorders?: boolean;
}

const Tag = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("rounded-full px-2 py-1 text-xs text-white/90", className)}>{children}</span>
);

const EnvironmentTag = ({ item, keyPrefix }: { item: string; keyPrefix: string }) => (
  <Tag key={`${keyPrefix}-env-${item}`} className="border border-white/20">
    {item}
  </Tag>
);

const ResponsibilityTag = ({ item, keyPrefix }: { item: string; keyPrefix: string }) => (
  <Tag key={`${keyPrefix}-${item}`} className="bg-white/10">
    {item}
  </Tag>
);

type RowMetaData = {
  hasDescription: boolean;
  hasEnvironment: boolean;
  hasResponsibilities: boolean;
  actionsRowSpan: number;
};

const processRowData = (row: ExtendedRowData): RowMetaData => {
  const description = row.description;
  const rawResponsibilities = row.responsibilities;
  const rawEnvironment = row.environment;

  const responsibilities = Array.isArray(rawResponsibilities) ? rawResponsibilities.map((value) => value?.trim()).filter(Boolean) : [];
  const environment = Array.isArray(rawEnvironment) ? rawEnvironment.filter(Boolean) : [];

  const hasDescription = Boolean(description?.trim());
  const hasEnvironment = environment.length > 0;
  const hasResponsibilities = responsibilities.length > 0;

  const actionsRowSpan = (hasDescription ? 1 : 0) + (hasEnvironment ? 1 : 0) + (hasResponsibilities ? 1 : 0) + 1;

  return { hasDescription, hasEnvironment, hasResponsibilities, actionsRowSpan };
};

const EmptyBorderRow = ({ colSpan, renderActions }: { colSpan: number; renderActions?: boolean }) => (
  <tr className={BORDER_CLASS}>
    <td colSpan={colSpan} className="h-0" />
    {renderActions && <td className="w-10" />}
  </tr>
);

const DescriptionRow = ({ description, colSpan, renderActions }: { description: string; colSpan: number; renderActions?: boolean }) => (
  <tr>
    <td
      colSpan={colSpan}
      className="px-4 pt-1 pb-2 text-sm text-white/70"
      style={{
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {description}
    </td>
    {renderActions && <td className="w-10" />}
  </tr>
);

const TagsRow = ({
  items,
  colSpan,
  renderActions,
  renderTag,
  keyPrefix,
  shouldShowBorder,
}: {
  items: string[];
  colSpan: number;
  renderActions?: boolean;
  renderTag: (item: string) => React.ReactNode;
  keyPrefix: string;
  shouldShowBorder: boolean;
}) => (
  <tr className={shouldShowBorder ? BORDER_CLASS : ""}>
    <td colSpan={colSpan} className="px-4 pb-4 pt-1 text-xs text-white/80">
      <div className="flex flex-wrap gap-2">{items.map(renderTag)}</div>
    </td>
    {renderActions && <td className="w-10" />}
  </tr>
);

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
  showRowBorders = false,
}: TableProps<T>) {
  const skeletonRowIndices = createSkeletonArray(skeletonRows);
  const { avatarColumn, primaryColumn, secondaryColumn, hasSummary: hasMobileSummary } = buildMobileSummaryConfig(
    columns,
    mobileSummaryKeys,
    DEFAULT_MOBILE_SUMMARY_KEYS
  );

  const defaultEmptyState = <span className="text-sm text-neutral-500">No data available</span>;
  const emptyStateContent = emptyState || defaultEmptyState;
  const colSpan = columns.length;

  const renderMobileRow = (row: T, index: number) => {
    const key = resolveTableRowKey(row, index, keyExtractor);

    return (
      <div key={key} className={cn("px-4 py-3", BORDER_CLASS)}>
        <div className="flex items-center gap-4">
          {avatarColumn && <div className="flex-shrink-0">{getTableCellContent(avatarColumn, row)}</div>}
          <div className="flex-1 flex items-center justify-between min-w-0 gap-4">
            {primaryColumn && <div className="text-white/80 text-sm font-medium truncate flex-1">{getTableCellContent(primaryColumn, row)}</div>}
            {secondaryColumn && <div className="text-white/80 text-sm text-right flex-shrink-0">{getTableCellContent(secondaryColumn, row)}</div>}
          </div>
          {renderActions && <div className="flex-shrink-0">{renderActions(row)}</div>}
        </div>
      </div>
    );
  };

  const renderTableRow = (row: T, index: number, rowData: ExtendedRowData, meta: RowMetaData) => {
    const key = resolveTableRowKey(row, index, keyExtractor);
    const { hasDescription, hasEnvironment, hasResponsibilities, actionsRowSpan } = meta;
    const shouldShowBorderAfterEnvironment = !hasResponsibilities;

    return (
      <React.Fragment key={key}>
        <tr className={cn(showRowBorders && BORDER_CLASS)}>
          {columns.map((column) => {
            const cellContent = getTableCellContent(column, row);
            return (
              <td
                key={String(column.key)}
                className={cn("px-4 py-4 text-sm text-white", column.className)}
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
            <td className="px-4 py-4 text-right align-top" rowSpan={actionsRowSpan}>
              <div className="flex items-center justify-end">{renderActions(row)}</div>
            </td>
          )}
        </tr>

        {hasDescription && <DescriptionRow description={rowData.description!} colSpan={colSpan} renderActions={!!renderActions} />}

        {hasEnvironment && (
          <TagsRow
            items={Array.isArray(rowData.environment) ? rowData.environment.filter(Boolean) : []}
            colSpan={colSpan}
            renderActions={!!renderActions}
            renderTag={(item) => <EnvironmentTag item={item} keyPrefix={key} />}
            keyPrefix={key}
            shouldShowBorder={shouldShowBorderAfterEnvironment}
          />
        )}

        {hasResponsibilities && (
          <TagsRow
            items={
              Array.isArray(rowData.responsibilities)
                ? rowData.responsibilities.map((value) => value?.trim()).filter(Boolean)
                : []
            }
            colSpan={colSpan}
            renderActions={!!renderActions}
            renderTag={(item) => <ResponsibilityTag item={item} keyPrefix={key} />}
            keyPrefix={key}
            shouldShowBorder={true}
          />
        )}

        {!hasResponsibilities && !hasEnvironment && hasDescription && <EmptyBorderRow colSpan={colSpan} renderActions={!!renderActions} />}
        {!hasResponsibilities && !hasEnvironment && !hasDescription && <EmptyBorderRow colSpan={colSpan} renderActions={!!renderActions} />}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className={cn("w-full overflow-x-auto", hasMobileSummary ? "hidden md:block" : "", className)}>
        <table className="w-full border-collapse">
          <thead>
            <tr className={BORDER_CLASS}>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-4 py-4 text-left text-sm font-bold text-white", column.className)}>
                  {column.header}
                </th>
              ))}
              {renderActions && <th className="px-4 py-4 text-right text-sm font-bold text-white/80 w-10" />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRowIndices.map((index) => (
                <tr key={`skeleton-${index}`} className={BORDER_CLASS}>
                  {columns.map((column) => (
                    <td key={String(column.key)} className={cn("px-4 py-4", column.className)}>
                      {column.key === "avatar" ? <Skeleton className="h-10 w-10 rounded-full" /> : <Skeleton className="h-5 w-full" />}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-5 w-5 rounded inline-block" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan + (renderActions ? 1 : 0)} className="px-4 py-8 text-center">
                  {emptyStateContent}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowData = row as ExtendedRowData;
                const meta = processRowData(rowData);
                return renderTableRow(row, index, rowData, meta);
              })
            )}
          </tbody>
        </table>
      </div>

      {hasMobileSummary && (
        <div className={cn("w-full md:hidden", className)}>
          {(primaryColumn || secondaryColumn) && (
            <div className={cn("flex items-center gap-4 px-4 py-3 mb-2", BORDER_CLASS)}>
              {avatarColumn && <div className="w-10" />}
              <div className="flex-1 flex items-center">
                {primaryColumn && <span className="text-sm font-bold text-white">{getMobileHeaderLabel(primaryColumn)}</span>}
                <div className="flex-1" />
                {secondaryColumn && <span className="text-sm font-bold text-white">{getMobileHeaderLabel(secondaryColumn)}</span>}
              </div>
              {renderActions && <div className="w-10" />}
            </div>
          )}

          <div>
            {loading ? (
              skeletonRowIndices.map((index) => (
                <div key={`skeleton-mobile-${index}`} className={cn("px-4 py-3", BORDER_CLASS)}>
                  <div className="flex items-center gap-4">
                    {avatarColumn ? <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" /> : null}
                    <div className="flex-1 flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      {secondaryColumn && <Skeleton className="h-4 w-24" />}
                    </div>
                    {renderActions && <Skeleton className="h-5 w-5 rounded flex-shrink-0" />}
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
