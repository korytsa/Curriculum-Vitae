"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import i18n from "@/shared/lib/i18n";
import { apolloClient, ApolloProvider } from "@/shared/lib/apollo-client";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";

type LayoutClientProps = {
	children: ReactNode;
	locale: string;
	fontClass: string;
};

export function LayoutClient({ children, locale, fontClass }: LayoutClientProps) {
	const pathname = usePathname();
	const isAuthPage = pathname?.includes("/login") || pathname?.includes("/signup");

	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	return (
		<body className={`${fontClass} antialiased`}>
			<ApolloProvider client={apolloClient}>
				{!isAuthPage && <Sidebar />}
				<I18nextProvider i18n={i18n}>
					<main className={isAuthPage ? "" : "content"}>{children}</main>
				</I18nextProvider>
			</ApolloProvider>
		</body>
	);
}
