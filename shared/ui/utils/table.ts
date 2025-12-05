import type { ReactNode } from "react";

import type { TableColumn } from "../table";

export const createSkeletonArray = (rows: number): number[] => Array.from({ length: rows }, (_, index) => index);

export const resolveTableRowKey = <T extends Record<string, unknown>>(row: T, index: number, keyExtractor?: (row: T) => string | number): string => {
  const value = keyExtractor ? keyExtractor(row) : index;
  return String(value);
};

export const getTableCellContent = <T extends Record<string, unknown>>(column: TableColumn<T>, row: T): ReactNode => {
  const value = row[column.key as keyof T];
  if (column.render) {
    return column.render(value, row);
  }
  return value != null ? String(value) : "";
};

export const getMobileHeaderLabel = <T extends Record<string, unknown>>(column: TableColumn<T> | null | undefined): string => {
  if (!column) return "";
  if (column.mobileHeaderLabel) return column.mobileHeaderLabel;
  if (typeof column.header === "string") return column.header;
  return "";
};

type MobileSummaryConfig<T> = {
  avatarColumn: TableColumn<T> | null;
  primaryColumn: TableColumn<T> | null;
  secondaryColumn: TableColumn<T> | null;
  hasSummary: boolean;
};

export const buildMobileSummaryConfig = <T extends Record<string, unknown>>(
  columns: TableColumn<T>[],
  mobileSummaryKeys?: Array<keyof T | string>,
  defaultKeys: readonly string[] = ["avatar", "first_name", "department_name"]
): MobileSummaryConfig<T> => {
  const keysToUse = mobileSummaryKeys?.length ? mobileSummaryKeys.map(String) : defaultKeys.map(String);

  const matchedColumns = keysToUse
    .map((key) => columns.find((col) => String(col.key) === key))
    .filter((col): col is TableColumn<T> => Boolean(col));

  if (matchedColumns.length === 0) {
    return {
      avatarColumn: null,
      primaryColumn: null,
      secondaryColumn: null,
      hasSummary: false,
    };
  }

  const avatarColumn = matchedColumns.find((col) => String(col.key) === "avatar") ?? null;
  const textColumns = matchedColumns.filter((col) => String(col.key) !== "avatar");

  return {
    avatarColumn,
    primaryColumn: textColumns[0] ?? null,
    secondaryColumn: textColumns[1] ?? null,
    hasSummary: true,
  };
};