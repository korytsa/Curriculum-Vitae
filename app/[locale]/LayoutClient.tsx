"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
	const router = useRouter();
	const isAuthPage =
		pathname?.includes("/login") || pathname?.includes("/signup") || pathname?.includes("/reset-password");

	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	useEffect(() => {
		if (isAuthPage) {
			return;
		}

		const storedToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

		if (!storedToken) {
			router.replace(`/${locale}/login`);
		}
	}, [isAuthPage, locale, router]);

	return (
		<body className={`${fontClass} antialiased`}>
			<ApolloProvider client={apolloClient}>
				{!isAuthPage && <Sidebar />}
				<I18nextProvider i18n={i18n}>
					<main
						className={
							isAuthPage
								? "min-h-screen"
								: "py-[14px] px-10 min-h-screen max-h-screen overflow-y-auto ml-[var(--sidebar-width,200px)] transition-[margin-left] duration-300 ease-in-out"
						}
					>
						{children}
					</main>
				</I18nextProvider>
			</ApolloProvider>
		</body>
	);
}
