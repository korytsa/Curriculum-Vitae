"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/shared/lib/i18n";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";

type LayoutClientProps = {
	children: ReactNode;
	locale: string;
	fontClass: string;
};

export function LayoutClient({ children, locale, fontClass }: LayoutClientProps) {
	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	return (
		<body className={`${fontClass} antialiased`}>
			<Sidebar />
			<I18nextProvider i18n={i18n}>
				<main className="py-[14px] px-10 min-h-screen max-h-screen overflow-y-auto ml-[var(--sidebar-width,200px)] transition-[margin-left] duration-300 ease-in-out">
				{children}
			</main>
			</I18nextProvider>
		</body>
	);
}
