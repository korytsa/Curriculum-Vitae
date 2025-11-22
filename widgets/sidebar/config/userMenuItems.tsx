import { IoMdSettings } from "react-icons/io";
import { BiSolidUserCircle } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import type { DropdownMenuItem } from "@/shared/ui";

interface BuildUserMenuItemsParams {
  id?: string;
  applyLocaleToPath: (path: string) => string;
  handleLogout: () => void;
}

export const buildUserMenuItems = ({
  id,
  applyLocaleToPath,
  handleLogout,
}: BuildUserMenuItemsParams): DropdownMenuItem[] => {
  const items: DropdownMenuItem[] = [
    {
      label: "Settings",
      icon: <IoMdSettings className="w-5 h-5" />,
      href: applyLocaleToPath("/settings"),
    },
    {
      type: "separator",
    },
    {
      label: "Logout",
      icon: <MdLogout className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ];

  if (id) {
    items.unshift({
      label: "Profile",
      icon: <BiSolidUserCircle className="w-5 h-5" />,
      href: applyLocaleToPath(`/users/${id}`),
    });
  }

  return items;
};
