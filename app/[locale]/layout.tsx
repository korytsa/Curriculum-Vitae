import type { Metadata } from "next";
import type { ReactNode } from "react";
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

export default async function RootLayout({ children, params }: RootLayoutProps) {
	await initLocale(params.locale);

	return (
		<html lang={params.locale}>
			<body className={`${inter.variable} antialiased`}>{children}</body>
		</html>
	);
}
