import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { requireAuth } from "@/shared/lib/auth-server";
import { LayoutClient } from "../LayoutClient";

type ProtectedLayoutProps = {
	children: ReactNode;
	params: { locale: string };
};

export default function ProtectedLayout({ children, params }: ProtectedLayoutProps) {
	requireAuth(params.locale);

	const cookieStore = cookies();
	const sidebarPreferenceCookie = cookieStore.get("sidebar-collapsed");
	const hasSidebarPreference = Boolean(sidebarPreferenceCookie);
	const isSidebarCollapsed = sidebarPreferenceCookie?.value === "true";

	return (
		<LayoutClient locale={params.locale} showSidebar initialSidebarCollapsed={isSidebarCollapsed} hasSidebarPreference={hasSidebarPreference}>
			{children}
		</LayoutClient>
	);
}
