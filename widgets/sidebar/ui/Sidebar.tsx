"use client";

import { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { menuItems } from "../config/menuItems";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

const SIDEBAR_WIDTH_EXPANDED = "200px";
const SIDEBAR_WIDTH_COLLAPSED = "60px";
const STORAGE_KEY = "sidebar-collapsed";

export default function Sidebar() {
	const pathname = usePathname();
	const params = useParams();
	const locale = typeof params?.locale === "string" ? params.locale : Array.isArray(params?.locale) ? params?.locale[0] : undefined;
	const segments = pathname.split("/").filter(Boolean);
	const firstSegmentAfterLocale = locale ? segments[1] : segments[0];
	const normalizedPath = firstSegmentAfterLocale ? `/${firstSegmentAfterLocale}` : "/";

	const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const value = stored === "true";
		setIsCollapsed(value);

		const width = value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
		document.documentElement.style.setProperty("--sidebar-width", width);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isCollapsed === null) return;
		const width = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
		document.documentElement.style.setProperty("--sidebar-width", width);
		localStorage.setItem(STORAGE_KEY, String(isCollapsed));
	}, [isCollapsed]);

	const toggleCollapse = () => {
		setIsCollapsed((prev) => !prev);
	};

	if (isCollapsed === null) return null;

	return (
		<aside
			className={cn(
				"flex flex-col justify-between h-screen bg-sidebar-bg pt-[42px] pb-5 text-white fixed top-0 left-0 z-[1000] transition-all duration-300 ease-in-out",
				isCollapsed ? "w-[60px]" : "w-[200px]",
			)}
		>
			<nav>
				<ul className="list-none p-0 m-0 flex flex-col gap-[14px]">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const localizedHref = locale ? `/${locale}${item.href}` : item.href;
						const isActive = normalizedPath === item.href;
						return (
							<li key={item.href}>
								<Link
									href={localizedHref}
									className={cn(
										"flex items-center gap-4 py-[17px] rounded-r-[28px] text-sidebar-text no-underline transition-colors duration-200 ease-in-out",
										isCollapsed ? "justify-center px-0" : "px-4",
										isActive && "text-white bg-sidebar-hover",
										!isActive && "hover:bg-sidebar-hover",
									)}
								>
									<Icon className="text-[21px]" />
									{!isCollapsed && <span className="whitespace-nowrap">{t(item.labelKey)}</span>}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="flex flex-col gap-3">
				<div
					className={cn(
						"flex items-center cursor-pointer rounded-r-[28px] transition-colors duration-200 ease-in-out hover:bg-sidebar-hover",
						isCollapsed ? "justify-center px-0" : "px-[10px] py-2",
					)}
				>
					<div className="w-10 h-10 rounded-full bg-sidebar-avatar-bg text-sidebar-avatar-text flex items-center justify-center font-semibold">
						{t("features.sidebar.avatar.initials")}
					</div>
					{!isCollapsed && <span className="text-sm font-normal text-white whitespace-nowrap overflow-hidden text-ellipsis ml-3">{t("features.sidebar.avatar.name")}</span>}
				</div>
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
