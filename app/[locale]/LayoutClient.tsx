"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "react-hot-toast";
import i18n from "@/shared/lib/i18n";
import { apolloClient, ApolloProvider } from "@/shared/lib/apollo-client";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import {
  applyThemePreference,
  ensureThemePreferenceApplied,
  getStoredThemePreference,
  listenToSystemThemeChanges,
} from "@/shared/lib/theme";

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

  useEffect(() => {
    ensureThemePreferenceApplied();

    const unsubscribe = listenToSystemThemeChanges(() => {
      const preference = getStoredThemePreference() ?? "system";
      if (preference === "system") {
        applyThemePreference("system");
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      {showSidebar && (
        <Sidebar
          initialCollapsed={initialSidebarCollapsed}
          hasInitialPreference={hasSidebarPreference}
        />
      )}
      <I18nextProvider i18n={i18n}>
        <Toaster position="top-right" reverseOrder={false} />
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
