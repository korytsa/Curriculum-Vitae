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
};

export function LayoutClient({ children, locale, showSidebar = true }: LayoutClientProps) {
	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	return (
		<ApolloProvider client={apolloClient}>
			{showSidebar && <Sidebar />}
			<I18nextProvider i18n={i18n}>
				<main
					className={
						showSidebar
							? "py-[14px] px-10 min-h-screen max-h-screen overflow-y-auto ml-[var(--sidebar-width,200px)] transition-[margin-left] duration-300 ease-in-out"
							: "min-h-screen"
					}
				>
					{children}
				</main>
			</I18nextProvider>
		</ApolloProvider>
	);
}
