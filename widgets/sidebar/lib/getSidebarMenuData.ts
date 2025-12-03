import type { MenuItem } from "../config/menuItems";

export type SidebarMenuData = {
  mobileItems: MenuItem[];
  desktopSections: MenuItem[][];
};

type SidebarMenuParams = {
  isAdmin: boolean;
  primaryMenuItems: MenuItem[];
  secondaryMenuItems: MenuItem[];
  employeeMenuItems: MenuItem[];
};

export function getSidebarMenuData({ isAdmin, primaryMenuItems, secondaryMenuItems, employeeMenuItems }: SidebarMenuParams): SidebarMenuData {
  if (isAdmin) {
    return {
      mobileItems: [...primaryMenuItems, ...secondaryMenuItems],
      desktopSections: [primaryMenuItems, secondaryMenuItems],
    };
  }

  return {
    mobileItems: employeeMenuItems,
    desktopSections: [employeeMenuItems],
  };
}
