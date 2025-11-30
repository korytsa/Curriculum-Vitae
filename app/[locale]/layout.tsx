import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { CSSProperties, ReactNode } from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import { initLocale } from "@/shared/lib/i18n-server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: "Manage employees, skills, languages, and CVs",
};

type RootLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  await initLocale(params.locale);
  const sidebarCollapsedCookie =
    cookies().get("sidebar-collapsed")?.value === "true";
  const htmlStyle = {
    "--sidebar-width": sidebarCollapsedCookie ? "60px" : "200px",
  } as CSSProperties;

  const themeInitScript = `
    (function() {
      const storageKey = 'theme-preference';
      const hasWindow = typeof window !== 'undefined';
      const hasDocument = typeof document !== 'undefined';
      const hasLocalStorage = hasWindow && typeof window.localStorage !== 'undefined';
      const stored = hasLocalStorage ? window.localStorage.getItem(storageKey) : null;
      const preference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
      const mediaQuery = hasWindow && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      const mode = preference === 'system' ? (mediaQuery && mediaQuery.matches ? 'dark' : 'light') : preference;
      if (hasDocument) {
        const appliedMode = mode || 'dark';
        document.documentElement.dataset.theme = appliedMode;
        document.documentElement.style.colorScheme = appliedMode;
      }
    })();
  `;

  return (
    <html lang={params.locale} style={htmlStyle}>
      <body className={`${inter.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        {children}
      </body>
    </html>
  );
}
