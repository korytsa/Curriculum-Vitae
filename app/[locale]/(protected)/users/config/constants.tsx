import { Avatar, type TableColumn } from "@/shared/ui";
import { getAvatarFallback } from "@/features/users/lib/getAvatarFallback";
import type { User } from "../types";

export const USERS_SEARCH_FIELDS = [
  "profile.first_name",
  "profile.last_name",
  "email",
] as const;

export const USERS_TABLE_COLUMNS: TableColumn<User>[] = [
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
        <span>First Name</span>
      </div>
    ),
    mobileHeaderLabel: "First Name",
    render: (_value: unknown, row: User) => (
      <span className="text-white/80">{row.profile.first_name}</span>
    ),
  },
  {
    key: "last_name",
    header: (
      <div className="flex items-center gap-2">
        <span>Last Name</span>
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
        <span>Email</span>
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
        <span>Department</span>
      </div>
    ),
    mobileHeaderLabel: "Department",
    render: (value: unknown) => (
      <span className="text-white/80">{value ? String(value) : ""}</span>
    ),
  },
  {
    key: "position_name",
    header: (
      <div className="flex items-center gap-2">
        <span>Position</span>
      </div>
    ),
    render: (value: unknown) => (
      <span className="text-white/80">{value ? String(value) : ""}</span>
    ),
  },
];
