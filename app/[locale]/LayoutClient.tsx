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
<<<<<<< HEAD
			<ApolloProvider client={apolloClient}>
				{!isAuthPage && <Sidebar />}
				<I18nextProvider i18n={i18n}>
					<main className={isAuthPage ? "" : "content"}>{children}</main>
				</I18nextProvider>
			</ApolloProvider>
=======
			<Sidebar />
			<I18nextProvider i18n={i18n}>
				<main className="py-[14px] px-10 min-h-screen max-h-screen overflow-y-auto ml-[var(--sidebar-width,200px)] transition-[margin-left] duration-300 ease-in-out">
				{children}
			</main>
			</I18nextProvider>
>>>>>>> dfda69db038178d758e0e042f5ca22831afdc8a9
		</body>
	);
}
