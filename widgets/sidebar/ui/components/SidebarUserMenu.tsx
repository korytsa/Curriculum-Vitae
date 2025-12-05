import { cn } from "@/shared/lib";
import { Avatar, DropdownMenu, Skeleton } from "@/shared/ui";
import type { SidebarUserMenuDropdownProps } from "../types";

type SidebarUserMenuProps = {
	variant: "mobile" | "desktop";
	isCollapsed?: boolean;
	isUserLoading: boolean;
	hasCurrentUser: boolean;
	currentUserAvatar: string | null;
	currentUserName: string | null;
	currentUserInitials: string;
	userMenuDropdownProps: SidebarUserMenuDropdownProps;
	t: (key: string) => string;
};

export function SidebarUserMenu({
	variant,
	isCollapsed = false,
	isUserLoading,
	hasCurrentUser,
	currentUserAvatar,
	currentUserName,
	currentUserInitials,
	userMenuDropdownProps,
	t,
}: SidebarUserMenuProps) {
	if (isUserLoading || !hasCurrentUser) {
		return <SidebarUserMenuSkeleton variant={variant} isCollapsed={isCollapsed} />;
	}

	const { className, menuClassName, ...menuProps } = userMenuDropdownProps;

	const variantConfig = getVariantConfig(variant, isCollapsed);
	const displayName = currentUserName || t("features.sidebar.avatar.name");

	return (
		<DropdownMenu
			{...menuProps}
			className={cn(variantConfig.wrapperClassName, className)}
			menuWidth={variantConfig.menuWidth}
			menuClassName={cn(variantConfig.menuClassName, menuClassName)}
		>
			<div className={variantConfig.triggerClassName}>
				<Avatar
					size={variantConfig.avatarSize}
					className="bg-red-600 text-white"
					src={currentUserAvatar || undefined}
					alt={displayName}
					fallback={currentUserInitials}
				/>
				{variantConfig.shouldShowName && <span className={variantConfig.nameClassName}>{displayName}</span>}
			</div>
		</DropdownMenu>
	);
}

type SidebarUserMenuSkeletonProps = {
	variant: "mobile" | "desktop";
	isCollapsed: boolean;
};

function SidebarUserMenuSkeleton({ variant, isCollapsed }: SidebarUserMenuSkeletonProps) {
	if (variant === "mobile") {
		return (
			<div className="flex items-center gap-2">
				<Skeleton className="w-8 h-8 rounded-full" />
				<Skeleton className="h-3 w-16 rounded-full" />
			</div>
		);
	}

	return (
		<div className={cn("flex items-center rounded-r-[28px] py-2 gap-3", isCollapsed ? "justify-center px-0" : "px-[10px] py-2")}>
			<Skeleton className="w-10 h-10 rounded-full" />
			{!isCollapsed && <Skeleton className="h-4 w-28 rounded-full" />}
		</div>
	);
}

type VariantConfig = {
	wrapperClassName: string;
	triggerClassName: string;
	menuWidth: string;
	menuClassName: string;
	avatarSize: "sm" | "md";
	nameClassName: string;
	shouldShowName: boolean;
};

function getVariantConfig(variant: "mobile" | "desktop", isCollapsed: boolean): VariantConfig {
	if (variant === "mobile") {
		return {
			wrapperClassName: "w-full",
			triggerClassName: "flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)]",
			menuWidth: "200px",
			menuClassName: "",
			avatarSize: "sm",
			nameClassName: "text-sm font-normal text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]",
			shouldShowName: true,
		};
	}

	return {
		wrapperClassName: "w-full",
		triggerClassName: cn(
			"flex gap-3 py-2 w-[190px] items-center cursor-pointer rounded-r-[28px] transition-colors duration-200 ease-in-out hover:bg-sidebar-hover",
			isCollapsed ? "justify-center px-3" : "px-[10px] py-2",
		),
		menuWidth: "190px",
		menuClassName: "ml-3 border border-white/5",
		avatarSize: "md",
		nameClassName: "font-normal whitespace-nowrap overflow-hidden text-ellipsis",
		shouldShowName: !isCollapsed,
	};
}


