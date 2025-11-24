"use client";

import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";
import { menuItems } from "../config/menuItems";
import { cn } from "@/shared/lib";
import { Avatar, Button, DropdownMenu } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/skeleton";
import { useSidebarState } from "../lib/useSidebarState";

type SidebarProps = {
  initialCollapsed?: boolean;
  hasInitialPreference?: boolean;
};

export default function Sidebar({
  initialCollapsed = false,
  hasInitialPreference = false,
}: SidebarProps) {
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
  } = useSidebarState({
    initialIsCollapsed: initialCollapsed,
    hasInitialPreference,
  });

  const userMenuDropdownProps = {
    items: userMenuItems,
    align: "bottom" as const,
    menuBgColor: "#353535",
    menuClassName: "shadow-xl border border-white/5",
  };

  return (
    <>
      <aside
        className={cn(
          "md:hidden flex items-center justify-between h-14 bg-sidebar-bg px-4 text-white fixed bottom-0 left-0 right-0 z-[1000] select-none border-t border-white/10"
        )}
      >
        <div className="flex items-center gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const localizedHref = applyLocaleToPath(item.href);
            const isActive = normalizedPath === item.href;

            return (
              <Link
                key={item.href}
                href={localizedHref}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors duration-200 ease-in-out",
                  isActive && "bg-sidebar-hover",
                  !isActive && "hover:bg-sidebar-hover/50"
                )}
                aria-label={t(item.labelKey)}
              >
                <Icon className="text-xl" />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {isUserLoading || !hasCurrentUser ? (
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
          ) : (
            <DropdownMenu
              {...userMenuDropdownProps}
              className="w-full"
              menuWidth="200px"
            >
              <div className="flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-full bg-[#353535]">
                <Avatar
                  size="sm"
                  className="bg-red-600 text-white"
                  src={currentUserAvatar || undefined}
                  alt={currentUserName || t("features.sidebar.avatar.name")}
                  fallback={currentUserInitials}
                />
                <span className="text-sm font-normal text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                  {currentUserName || t("features.sidebar.avatar.name")}
                </span>
              </div>
            </DropdownMenu>
          )}
        </div>
      </aside>

      <aside
        className={cn(
          "hidden md:flex flex-col justify-between h-screen bg-sidebar-bg pt-[42px] pb-5 text-white fixed top-0 left-0 z-[1000] select-none transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[200px]"
        )}
      >
        <nav>
          <ul className="list-none p-0 m-0 flex flex-col gap-[14px]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const localizedHref = applyLocaleToPath(item.href);
              const isActive = normalizedPath === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={localizedHref}
                    className={cn(
                      "flex items-center gap-4 py-[17px] rounded-r-[28px] text-sidebar-text no-underline transition-colors duration-200 ease-in-out",
                      isCollapsed ? "justify-center px-0" : "px-4",
                      isActive && "text-white bg-sidebar-hover",
                      !isActive && "hover:bg-sidebar-hover"
                    )}
                  >
                    <Icon className="text-[21px]" />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap">
                        {t(item.labelKey)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <div className="relative">
            {isUserLoading || !hasCurrentUser ? (
              <div
                className={cn(
                  "flex items-center rounded-r-[28px] py-2",
                  isCollapsed ? "justify-center px-0" : "px-[10px] py-2",
                  "gap-3"
                )}
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                {!isCollapsed && <Skeleton className="h-4 w-28 rounded-full" />}
              </div>
            ) : (
              <DropdownMenu
                {...userMenuDropdownProps}
                className="w-full"
                menuWidth="100%"
                menuClassName="ml-3 border border-white/5"
              >
                <div
                  className={cn(
                    "flex gap-3 py-2 w-[190px] items-center cursor-pointer rounded-r-[28px] transition-colors duration-200 ease-in-out hover:bg-sidebar-hover",
                    isCollapsed ? "justify-center px-3" : "px-[10px] py-2"
                  )}
                >
                  <Avatar
                    size={isCollapsed ? "sm" : "md"}
                    className="bg-red-600 text-white"
                    src={currentUserAvatar || undefined}
                    alt={currentUserName || t("features.sidebar.avatar.name")}
                    fallback={currentUserInitials}
                  />
                  {!isCollapsed && (
                    <span className="font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentUserName || t("features.sidebar.avatar.name")}
                    </span>
                  )}
                </div>
              </DropdownMenu>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-[10px] bg-transparent border-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-sidebar-hover"
            onClick={toggleCollapse}
            aria-label={
              isCollapsed
                ? t("features.sidebar.aria.expand")
                : t("features.sidebar.aria.collapse")
            }
          >
            <IoChevronBackOutline
              className={cn(
                "text-xl text-white transition-transform duration-300 ease-in-out",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </aside>
    </>
  );
}
