import type { ReactNode } from "react";
import type { TableColumn } from "@/shared/ui";
import type { CvListItem } from "@/features/cvs";

export const CVS_SEARCH_FIELDS = ["name", "education", "description", "user.email", "user.profile.full_name"] as const;

type CvsTableLabels = {
  name: ReactNode;
  education: ReactNode;
  employee: ReactNode;
  emptyValue?: ReactNode;
};

export const createCvsTableColumns = (labels: CvsTableLabels): TableColumn<CvListItem>[] => {
  const { emptyValue = "—" } = labels;

  return [
    {
      key: "name",
      header: labels.name,
      className: "align-top w-1/4 normal-case",
      mobileHeaderLabel: typeof labels.name === "string" ? labels.name : undefined,
      render: (_value, row) => <span className="text-white font-semibold leading-snug break-words capitalize">{row.name || emptyValue}</span>,
    },
    {
      key: "education",
      header: labels.education,
      className: "align-top w-1/4 normal-case",
      render: (value) => <span className="text-white/80">{value ? String(value) : emptyValue}</span>,
    },
    {
      key: "employee",
      header: labels.employee,
      className: "align-top w-1/4 normal-case",
      mobileHeaderLabel: typeof labels.employee === "string" ? labels.employee : undefined,
      render: (_value, row) => {
        const email = row.user?.email;
        if (email && typeof email === "string" && email.trim()) {
          return <span className="text-white/80">{email.trim()}</span>;
        }
        return <span className="text-white/80">{emptyValue}</span>;
      },
    },
  ];
};
