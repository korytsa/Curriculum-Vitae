import Link from "next/link";
import { cn } from "@/shared/lib";
import type { MenuItem } from "../../config/menuItems";
import type { SidebarUserMenuDropdownProps } from "../types";
import { SidebarUserMenu } from "./SidebarUserMenu";

type SidebarMobileNavProps = {
	items: MenuItem[];
	normalizedPath: string;
	applyLocaleToPath: (path: string) => string;
	t: (key: string) => string;
	isUserLoading: boolean;
	hasCurrentUser: boolean;
	currentUserAvatar: string | null;
	currentUserName: string | null;
	currentUserInitials: string;
	userMenuDropdownProps: SidebarUserMenuDropdownProps;
};

type MobileMenuItemLinkProps = {
	item: MenuItem;
	normalizedPath: string;
	applyLocaleToPath: (path: string) => string;
	t: (key: string) => string;
};

export function SidebarMobileNav({
	items,
	normalizedPath,
	applyLocaleToPath,
	t,
	isUserLoading,
	hasCurrentUser,
	currentUserAvatar,
	currentUserName,
	currentUserInitials,
	userMenuDropdownProps,
}: SidebarMobileNavProps) {
	return (
		<aside className="md:hidden flex items-center justify-between h-14 bg-sidebar-bg px-4 text-white fixed bottom-0 left-0 right-0 z-[1000] select-none border-t border-white/10">
			<div className="flex items-center gap-4">
				{items.map((item) => (
					<MobileMenuItemLink
						key={item.href}
						item={item}
						normalizedPath={normalizedPath}
						applyLocaleToPath={applyLocaleToPath}
						t={t}
					/>
				))}
			</div>
			<SidebarUserMenu
				variant="mobile"
				isUserLoading={isUserLoading}
				hasCurrentUser={hasCurrentUser}
				currentUserAvatar={currentUserAvatar}
				currentUserName={currentUserName}
				currentUserInitials={currentUserInitials}
				userMenuDropdownProps={userMenuDropdownProps}
				t={t}
			/>
		</aside>
	);
}

function MobileMenuItemLink({ item, normalizedPath, applyLocaleToPath, t }: MobileMenuItemLinkProps) {
	const Icon = item.icon;
	const localizedHref = applyLocaleToPath(item.href);
	const isActive = normalizedPath === item.href;

	return (
		<Link
			href={localizedHref}
			className={cn(
				"flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors duration-200 ease-in-out",
				isActive && "bg-sidebar-hover",
				!isActive && "hover:bg-sidebar-hover/50",
			)}
			aria-label={t(item.labelKey)}
		>
			<Icon className="text-xl" />
		</Link>
	);
}
