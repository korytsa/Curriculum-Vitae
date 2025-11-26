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
      try {
        const storageKey = 'theme-preference';
        const stored = window.localStorage.getItem(storageKey);
        const preference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const mode = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
        document.documentElement.dataset.theme = mode;
        document.documentElement.style.colorScheme = mode;
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.style.colorScheme = 'dark';
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
