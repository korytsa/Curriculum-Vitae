import { IoEllipsisVertical } from "react-icons/io5";
import { DropdownMenu } from "@/shared/ui";
import type { DropdownMenuItem } from "@/shared/ui";
import type { User } from "../types";

interface UserActionsMenuProps {
  user: User;
  onViewProfile: (userId: string) => void;
}

export function UserActionsMenu({ user, onViewProfile }: UserActionsMenuProps) {
  const menuItems: DropdownMenuItem[] = [
    {
      label: "Profile",
      onClick: () => onViewProfile(user.id),
    },
    {
      label: "Update user",
      onClick: () => {},
    },
    {
      label: "Delete user",
      disabled: true,
      onClick: () => {},
    },
  ];

  return (
    <DropdownMenu
      items={menuItems}
      align="right"
      menuWidth="150px"
      menuBgColor="#2F2F2F"
      menuClassName="shadow-xl border border-white/5"
    >
      <button
        type="button"
        aria-label="Open user actions"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
      >
        <IoEllipsisVertical className="w-4 h-4" />
      </button>
    </DropdownMenu>
  );
}
