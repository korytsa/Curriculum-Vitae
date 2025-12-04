"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TableRowActions } from "@/shared/ui";
import type { TableColumn, DropdownMenuItem } from "@/shared/ui";
import { ADMIN_SKILLS_SEARCH_FIELDS } from "./constants";
import { mapSkillToTableRow } from "../model/utils";
import type { UseAdminSkillsTableParams, UseAdminSkillsTableResult, AdminSkill, AdminSkillTableRow } from "../types";

export function useAdminSkillsTable({ skills, isLoading = false, onEdit, onDelete }: UseAdminSkillsTableParams): UseAdminSkillsTableResult {
  const { t } = useTranslation();

  const [filteredSkills, setFilteredSkills] = useState<AdminSkill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey] = useState(0);

  useEffect(() => {
    setFilteredSkills(skills);
  }, [skills]);

  const handleSearchResults = (results: AdminSkillTableRow[]) => {
    const resultIds = new Set(results.map((r) => r.id));
    setFilteredSkills(skills.filter((skill) => resultIds.has(skill.id)));
  };

  const isSearchActive = searchQuery.trim().length > 0;

  const searchTableRows: AdminSkillTableRow[] = skills.map(mapSkillToTableRow);

  const searchInputProps = {
    data: searchTableRows,
    fields: [...ADMIN_SKILLS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && filteredSkills.length === 0,
    placeholder: t("admin.skills.search.placeholder"),
  };

  const tableRows: AdminSkillTableRow[] = filteredSkills.map(mapSkillToTableRow);

  const columns: TableColumn<AdminSkillTableRow>[] = [
    {
      key: "name",
      header: (
        <div className="flex items-center gap-2">
          <span>{t("admin.skills.table.columns.name")}</span>
        </div>
      ),
      render: (value: unknown) => <span className="text-white/80">{String(value)}</span>,
    },
    {
      key: "type",
      header: (
        <div className="flex items-center gap-2">
          <span>{t("admin.skills.table.columns.type")}</span>
        </div>
      ),
      render: (value: unknown) => <span className="text-white/80">{String(value)}</span>,
    },
    {
      key: "category",
      header: (
        <div className="flex items-center gap-2">
          <span>{t("admin.skills.table.columns.category")}</span>
        </div>
      ),
      render: (value: unknown) => <span className="text-white/80">{String(value)}</span>,
    },
  ];

  const renderRowActions = (row: AdminSkillTableRow) => {
    const skill = filteredSkills.find((s) => s.id === row.id);
    if (!skill) return null;

    const menuItems: DropdownMenuItem[] = [
      {
        label: t("admin.skills.table.actions.update"),
        onClick: () => onEdit(skill),
      },
      {
        label: t("admin.skills.table.actions.remove"),
        onClick: () => onDelete(skill),
      },
    ];

    return <TableRowActions items={menuItems} ariaLabel={t("admin.skills.table.actions.ariaLabel")} />;
  };

  const tableProps = {
    data: tableRows,
    columns,
    loading: isLoading,
    keyExtractor: (row: AdminSkillTableRow) => row.id,
    renderActions: renderRowActions,
    emptyState: (
      <div className="py-8 text-center">
        <span className="text-sm text-neutral-500">{t("admin.skills.table.empty")}</span>
      </div>
    ),
  };

  return {
    searchInputProps,
    tableProps,
  };
}
