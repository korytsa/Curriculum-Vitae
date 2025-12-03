"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table, TableRowActions, type TableColumn } from "@/shared/ui";
import type { AdminSkill, AdminSkillTableRow } from "../model/adminTypes";
import type { DropdownMenuItem } from "@/shared/ui";

interface AdminSkillsTableProps {
  skills: AdminSkill[];
  loading?: boolean;
  onEdit: (skill: AdminSkill) => void;
  onDelete: (skill: AdminSkill) => void;
}

export function AdminSkillsTable({ skills, loading, onEdit, onDelete }: AdminSkillsTableProps) {
  const { t } = useTranslation();

  const tableRows: AdminSkillTableRow[] = useMemo(() => {
    return skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      type: skill.category_parent_name || skill.category?.name || "",
      category: skill.category_name || skill.category?.name || "",
      categoryId: skill.category?.id || null,
    }));
  }, [skills]);

  const columns: TableColumn<AdminSkillTableRow>[] = useMemo(
    () => [
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
    ],
    [t]
  );

  const renderRowActions = (row: AdminSkillTableRow) => {
    const skill = skills.find((s) => s.id === row.id);
    if (!skill) return null;

    const menuItems: DropdownMenuItem[] = [
      {
        label: t("admin.skills.table.actions.edit"),
        onClick: () => onEdit(skill),
      },
      {
        label: t("admin.skills.table.actions.delete"),
        onClick: () => onDelete(skill),
      },
    ];

    return <TableRowActions items={menuItems} ariaLabel={t("admin.skills.table.actions.ariaLabel")} />;
  };

  return (
    <Table
      data={tableRows}
      columns={columns}
      loading={loading}
      keyExtractor={(row) => row.id}
      renderActions={renderRowActions}
      showRowBorders={true}
      emptyState={
        <div className="py-8 text-center">
          <span className="text-sm text-neutral-500">{t("admin.skills.table.empty")}</span>
        </div>
      }
    />
  );
}
