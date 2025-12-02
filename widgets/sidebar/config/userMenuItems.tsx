import { IoMdSettings } from "react-icons/io";
import { BiSolidUserCircle } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import type { DropdownMenuItem } from "@/shared/ui";

type TranslateFn = (key: string) => string;

interface BuildUserMenuItemsParams {
  id?: string;
  applyLocaleToPath: (path: string) => string;
  handleLogout: () => void;
  translate: TranslateFn;
}

export const buildUserMenuItems = ({ id, applyLocaleToPath, handleLogout, translate }: BuildUserMenuItemsParams): DropdownMenuItem[] => {
  const getLabel = (key: string) => translate(key);

  const items: DropdownMenuItem[] = [
    {
      label: getLabel("features.sidebar.userMenu.settings"),
      icon: <IoMdSettings className="w-5 h-5" />,
      href: applyLocaleToPath("/settings"),
    },
    {
      type: "separator",
    },
    {
      label: getLabel("features.sidebar.userMenu.logout"),
      icon: <MdLogout className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ];

  if (id) {
    items.unshift({
      label: getLabel("features.sidebar.userMenu.profile"),
      icon: <BiSolidUserCircle className="w-5 h-5" />,
      href: applyLocaleToPath(`/users/${id}`),
    });
  }

  return items;
};
