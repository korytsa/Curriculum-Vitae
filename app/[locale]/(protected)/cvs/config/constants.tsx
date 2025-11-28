import type { TableColumn } from "@/shared/ui";
import type { CvListItem } from "@/features/cvs";

export const CVS_SEARCH_FIELDS = [
  "name",
  "education",
  "description",
  "user.email",
  "user.profile.full_name",
] as const;

export function getCvsTableColumns(
  t: (key: string) => string
): TableColumn<CvListItem>[] {
  const nameLabel = t("cvs.table.columns.name");
  const educationLabel = t("cvs.table.columns.education");
  const employeeLabel = t("cvs.table.columns.employee");

  return [
    {
      key: "name",
      header: (
        <div className="flex items-center gap-2">
          <span className="text-white">{nameLabel}</span>
          <span className="text-xs text-white/50">↑</span>
        </div>
      ),
      className: "align-top w-1/4",
      mobileHeaderLabel: nameLabel,
      render: (_value, row) => (
        <span className="text-white font-semibold leading-snug break-words">
          {row.name}
        </span>
      ),
    },
    {
      key: "education",
      header: educationLabel,
      className: "align-top w-1/4",
      render: (value) => (
        <span className="text-white/80">{value ? String(value) : "—"}</span>
      ),
    },
    {
      key: "employee",
      header: employeeLabel,
      className: "align-top w-1/4",
      mobileHeaderLabel: employeeLabel,
      render: (_value, row) => {
        const email = row.user?.email;
        if (email && typeof email === "string" && email.trim()) {
          return <span className="text-white/80">{email.trim()}</span>;
        }
        return <span className="text-white/80">—</span>;
      },
    },
  ] as TableColumn<CvListItem>[];
}
