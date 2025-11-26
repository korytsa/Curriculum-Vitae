import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutClient } from "../LayoutClient";

type ProtectedLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default function ProtectedLayout({
  children,
  params,
}: ProtectedLayoutProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const sidebarPreferenceCookie = cookieStore.get("sidebar-collapsed");
  const hasSidebarPreference = Boolean(sidebarPreferenceCookie);
  const isSidebarCollapsed = sidebarPreferenceCookie?.value === "true";

  if (!token) {
    redirect(`/${params.locale}/login`);
  }

  return (
    <LayoutClient
      locale={params.locale}
      showSidebar
      initialSidebarCollapsed={isSidebarCollapsed}
      hasSidebarPreference={hasSidebarPreference}
    >
      {children}
    </LayoutClient>
  );
}
