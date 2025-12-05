import { Fragment } from "react";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import type { MenuItem } from "../../config/menuItems";
import type { SidebarUserMenuDropdownProps } from "../types";
import { SidebarUserMenu } from "./SidebarUserMenu";

type SidebarDesktopNavProps = {
	sections: MenuItem[][];
	normalizedPath: string;
	applyLocaleToPath: (path: string) => string;
	t: (key: string) => string;
	isCollapsed: boolean;
	toggleCollapse: () => void;
	isUserLoading: boolean;
	hasCurrentUser: boolean;
	currentUserAvatar: string | null;
	currentUserName: string | null;
	currentUserInitials: string;
	userMenuDropdownProps: SidebarUserMenuDropdownProps;
};

export function SidebarDesktopNav({
	sections,
	normalizedPath,
	applyLocaleToPath,
	t,
	isCollapsed,
	toggleCollapse,
	isUserLoading,
	hasCurrentUser,
	currentUserAvatar,
	currentUserName,
	currentUserInitials,
	userMenuDropdownProps,
}: SidebarDesktopNavProps) {
	return (
		<aside
			className={cn(
				"hidden md:flex flex-col justify-between h-screen bg-sidebar-bg pt-[42px] pb-5 text-white fixed top-0 left-0 z-[1000] select-none transition-all duration-300 ease-in-out",
				isCollapsed ? "w-[60px]" : "w-[200px]",
			)}
		>
			<nav>
				<ul className="list-none p-0 m-0 flex flex-col gap-[12px]">
					{sections.map((section, sectionIndex) => (
						<Fragment key={sectionIndex}>
							{section.map((item) => (
								<li key={item.href}>
									<MenuItemLink
										item={item}
										normalizedPath={normalizedPath}
										isCollapsed={isCollapsed}
										applyLocaleToPath={applyLocaleToPath}
										t={t}
									/>
								</li>
							))}
							{!isCollapsed && sectionIndex < sections.length - 1 && (
								<li>
									<div className="h-px bg-white/10" />
								</li>
							)}
						</Fragment>
					))}
				</ul>
			</nav>

			<div className="flex flex-col gap-3">
				<SidebarUserMenu
					variant="desktop"
					isCollapsed={isCollapsed}
					isUserLoading={isUserLoading}
					hasCurrentUser={hasCurrentUser}
					currentUserAvatar={currentUserAvatar}
					currentUserName={currentUserName}
					currentUserInitials={currentUserInitials}
					userMenuDropdownProps={userMenuDropdownProps}
					t={t}
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="ml-[10px] bg-transparent border-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-sidebar-hover"
					onClick={toggleCollapse}
					aria-label={isCollapsed ? t("features.sidebar.aria.expand") : t("features.sidebar.aria.collapse")}
				>
					<IoChevronBackOutline className={cn("text-xl text-white transition-transform duration-300 ease-in-out", isCollapsed && "rotate-180")} />
				</Button>
			</div>
		</aside>
	);
}

type MenuItemLinkProps = {
	item: MenuItem;
	normalizedPath: string;
	isCollapsed: boolean;
	applyLocaleToPath: (path: string) => string;
	t: (key: string) => string;
};

function MenuItemLink({ item, normalizedPath, isCollapsed, applyLocaleToPath, t }: MenuItemLinkProps) {
	const Icon = item.icon;
	const localizedHref = applyLocaleToPath(item.href);
	const isActive = normalizedPath === item.href;

	return (
		<Link
			href={localizedHref}
			className={cn(
				"flex items-center gap-4 py-4 rounded-r-[28px] text-sidebar-text no-underline transition-colors duration-200 ease-in-out",
				isCollapsed ? "justify-center px-0" : "px-4",
				isActive && "text-white bg-sidebar-hover",
				!isActive && "hover:bg-sidebar-hover",
			)}
		>
			<Icon className="text-[21px]" />
			{!isCollapsed && <span className="whitespace-nowrap">{t(item.labelKey)}</span>}
		</Link>
	);
}
