"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/shared/lib/i18n";
import { apolloClient, ApolloProvider } from "@/shared/lib/apollo-client";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";

type LayoutClientProps = {
  children: ReactNode;
  locale: string;
  showSidebar?: boolean;
  initialSidebarCollapsed?: boolean;
  hasSidebarPreference?: boolean;
};

export function LayoutClient({
  children,
  locale,
  showSidebar = true,
  initialSidebarCollapsed = false,
  hasSidebarPreference = false,
}: LayoutClientProps) {
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <ApolloProvider client={apolloClient}>
      {showSidebar && (
        <Sidebar
          initialCollapsed={initialSidebarCollapsed}
          hasInitialPreference={hasSidebarPreference}
        />
      )}
      <I18nextProvider i18n={i18n}>
        <main
          className={
            showSidebar
              ? "py-[14px] min-h-screen max-h-screen overflow-y-auto ml-0 px-4 pb-[70px] transition-[margin-left] duration-300 ease-in-out md:pt-[14px] md:pb-[14px] md:pl-10 md:pr-2 md:ml-[var(--sidebar-width,200px)]"
              : "min-h-screen"
          }
        >
          {children}
        </main>
      </I18nextProvider>
    </ApolloProvider>
  );
}
