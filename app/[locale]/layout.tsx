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

  return (
    <html lang={params.locale} style={htmlStyle}>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
