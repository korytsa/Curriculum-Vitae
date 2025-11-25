import type { TableColumn } from "@/shared/ui";
import type { CvListItem } from "@/features/cvs";

export const CVS_SEARCH_FIELDS = [
  "name",
  "education",
  "description",
  "user.email",
  "user.profile.full_name",
] as const;

export const CVS_TABLE_COLUMNS: TableColumn<CvListItem>[] = [
  {
    key: "name",
    header: (
      <div className="flex items-center gap-2">
        <span className="text-white">Name</span>
        <span className="text-xs text-white/50">↑</span>
      </div>
    ),
    className: "align-top w-1/4",
    mobileHeaderLabel: "Name",
    render: (_value, row) => (
      <span className="text-white font-semibold leading-snug break-words">
        {row.name}
      </span>
    ),
  },
  {
    key: "education",
    header: "Education",
    className: "align-top w-1/4",
    render: (value) => (
      <span className="text-white/80">{value ? String(value) : "—"}</span>
    ),
  },
  {
    key: "employee",
    header: "Employee",
    className: "align-top w-1/4",
    mobileHeaderLabel: "Employee",
    render: (_value, row) => {
      const email = row.user?.email;
      if (email && typeof email === "string" && email.trim()) {
        return <span className="text-white/80">{email.trim()}</span>;
      }
      return <span className="text-white/80">—</span>;
    },
  },
];
