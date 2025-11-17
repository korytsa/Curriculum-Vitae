"use client";

import { useState, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { menuItems } from "../config/menuItems";

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
		<aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
			<nav className={styles.nav}>
				<ul className={styles.menuList}>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const localizedHref = locale ? `/${locale}${item.href}` : item.href;
						const isActive = normalizedPath === item.href;
						return (
							<li key={item.href} className={styles.menuItem}>
								<Link href={localizedHref} className={`${styles.menuLink} ${isActive ? styles.active : ""}`}>
									<Icon className={styles.menuIcon} />
									{!isCollapsed && <span className={styles.menuText}>{item.label}</span>}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className={styles.userSection}>
				<div className={styles.userProfile}>
					<div className={styles.avatar}>R</div>
					{!isCollapsed && <span className={styles.userName}>Rostislav Harlanov</span>}
				</div>
				<button className={styles.collapseButton} onClick={toggleCollapse} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
					<IoChevronBackOutline className={`${styles.collapseIcon} ${isCollapsed ? styles.rotated : ""}`} />
				</button>
			</div>
		</aside>
	);
}
