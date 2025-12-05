"use client";

import { SidebarDesktopNav } from "./components/SidebarDesktopNav";
import { SidebarMobileNav } from "./components/SidebarMobileNav";
import type { SidebarUserMenuDropdownProps } from "./types";
import { getSidebarMenuData } from "../lib/getSidebarMenuData";
import { useSidebarState } from "../lib/useSidebarState";
import { useIsAdmin } from "@/shared/lib/useIsAdmin";

type SidebarProps = {
  initialCollapsed?: boolean;
  hasInitialPreference?: boolean;
};

export default function Sidebar({ initialCollapsed = false, hasInitialPreference = false }: SidebarProps) {
  const {
    t,
    normalizedPath,
    isCollapsed,
    toggleCollapse,
    applyLocaleToPath,
    currentUserInitials,
    currentUserName,
    currentUserAvatar,
    userMenuItems,
    isUserLoading,
    hasCurrentUser,
    primaryMenuItems,
    secondaryMenuItems,
    employeeMenuItems,
  } = useSidebarState({
    initialIsCollapsed: initialCollapsed,
    hasInitialPreference,
  });

  const userMenuDropdownProps: SidebarUserMenuDropdownProps = {
    items: userMenuItems,
    align: "top" as const,
    menuBgColor: "var(--color-surface)",
    menuClassName: "shadow-xl border border-white/5",
  };

  const isAdmin = useIsAdmin();

  const { mobileItems, desktopSections } = getSidebarMenuData({
    isAdmin,
    primaryMenuItems,
    secondaryMenuItems,
    employeeMenuItems,
  });

  return (
    <>
      <SidebarMobileNav
        items={mobileItems}
        normalizedPath={normalizedPath}
        applyLocaleToPath={applyLocaleToPath}
        t={t}
        isUserLoading={isUserLoading}
        hasCurrentUser={hasCurrentUser}
        currentUserAvatar={currentUserAvatar}
        currentUserName={currentUserName}
        currentUserInitials={currentUserInitials}
        userMenuDropdownProps={userMenuDropdownProps}
      />

      <SidebarDesktopNav
        sections={desktopSections}
        normalizedPath={normalizedPath}
        applyLocaleToPath={applyLocaleToPath}
        t={t}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isUserLoading={isUserLoading}
        hasCurrentUser={hasCurrentUser}
        currentUserAvatar={currentUserAvatar}
        currentUserName={currentUserName}
        currentUserInitials={currentUserInitials}
        userMenuDropdownProps={userMenuDropdownProps}
      />
    </>
  );
}
