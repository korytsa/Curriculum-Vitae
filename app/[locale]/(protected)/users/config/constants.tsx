import { Avatar, type TableColumn } from "@/shared/ui";
import { getAvatarFallback } from "@/features/users/lib/getAvatarFallback";
import type { User } from "../types";

export const USERS_SEARCH_FIELDS = ["profile.first_name", "profile.last_name", "email"] as const;

type UserTableLabels = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
};

export const createUsersTableColumns = (labels: UserTableLabels): TableColumn<User>[] => [
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
        <span>{labels.firstName}</span>
      </div>
    ),
    mobileHeaderLabel: labels.firstName,
    render: (_value: unknown, row: User) => <span className="text-white/80">{row.profile.first_name}</span>,
  },
  {
    key: "last_name",
    header: (
      <div className="flex items-center gap-2">
        <span>{labels.lastName}</span>
      </div>
    ),
    mobileHeaderLabel: labels.lastName,
    render: (_value: unknown, row: User) => <span className="text-white/80">{row.profile.last_name}</span>,
  },
  {
    key: "email",
    header: (
      <div className="flex items-center gap-2">
        <span>{labels.email}</span>
      </div>
    ),
    mobileHeaderLabel: labels.email,
    render: (value: unknown) => <span className="text-white/80">{String(value)}</span>,
  },
  {
    key: "department_name",
    header: (
      <div className="flex items-center gap-2">
        <span>{labels.department}</span>
      </div>
    ),
    mobileHeaderLabel: labels.department,
    render: (value: unknown) => <span className="text-white/80">{value ? String(value) : ""}</span>,
  },
  {
    key: "position_name",
    header: (
      <div className="flex items-center gap-2">
        <span>{labels.position}</span>
      </div>
    ),
    mobileHeaderLabel: labels.position,
    render: (value: unknown) => <span className="text-white/80">{value ? String(value) : ""}</span>,
  },
];
