import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import { LayoutClient } from "./LayoutClient";

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

export default function RootLayout({ children, params }: RootLayoutProps) {
	return (
		<html lang={params.locale}>
			<LayoutClient locale={params.locale} fontClass={inter.variable}>
				{children}
			</LayoutClient>
		</html>
	);
}
