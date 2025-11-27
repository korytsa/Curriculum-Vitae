import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, type TableColumn } from "@/shared/ui";
import { getAvatarFallback } from "@/features/users/lib/getAvatarFallback";
import type { User } from "../types";

export const USERS_SEARCH_FIELDS = [
  "profile.first_name",
  "profile.last_name",
  "email",
] as const;

export function useUsersTableColumns(): TableColumn<User>[] {
  const { t } = useTranslation();

  return useMemo(() => {
    const firstNameLabel = t("users.table.columns.firstName", {
      defaultValue: "First Name",
    });
    const lastNameLabel = t("users.table.columns.lastName", {
      defaultValue: "Last Name",
    });
    const emailLabel = t("users.table.columns.email", {
      defaultValue: "Email",
    });
    const departmentLabel = t("users.table.columns.department", {
      defaultValue: "Department",
    });
    const positionLabel = t("users.table.columns.position", {
      defaultValue: "Position",
    });

    return [
      {
        key: "avatar",
        header: "",
        className: "w-16",
        render: (_value: unknown, row: User) => (
          <div className="flex items-center">
            <Avatar
              src={row.profile.avatar || undefined}
              alt={`${row.profile.first_name || ""} ${row.profile.last_name || ""}`}
              fallback={getAvatarFallback({
                firstName: row.profile.first_name,
                email: row.email,
              })}
              size="md"
            />
          </div>
        ),
      },
      {
        key: "first_name",
        header: (
          <div className="flex items-center gap-2">
            <span>{firstNameLabel}</span>
          </div>
        ),
        mobileHeaderLabel: firstNameLabel,
        render: (_value: unknown, row: User) => (
          <span className="text-white/80">{row.profile.first_name}</span>
        ),
      },
      {
        key: "last_name",
        header: (
          <div className="flex items-center gap-2">
            <span>{lastNameLabel}</span>
          </div>
        ),
        render: (_value: unknown, row: User) => (
          <span className="text-white/80">{row.profile.last_name}</span>
        ),
      },
      {
        key: "email",
        header: (
          <div className="flex items-center gap-2">
            <span>{emailLabel}</span>
          </div>
        ),
        render: (value: unknown) => (
          <span className="text-white/80">{String(value)}</span>
        ),
      },
      {
        key: "department_name",
        header: (
          <div className="flex items-center gap-2">
            <span>{departmentLabel}</span>
          </div>
        ),
        mobileHeaderLabel: departmentLabel,
        render: (value: unknown) => (
          <span className="text-white/80">{value ? String(value) : ""}</span>
        ),
      },
      {
        key: "position_name",
        header: (
          <div className="flex items-center gap-2">
            <span>{positionLabel}</span>
          </div>
        ),
        render: (value: unknown) => (
          <span className="text-white/80">{value ? String(value) : ""}</span>
        ),
      },
    ] as TableColumn<User>[];
  }, [t]);
}
