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
