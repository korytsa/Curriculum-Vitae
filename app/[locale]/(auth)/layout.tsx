import type { ReactNode } from "react";
import { LayoutClient } from "../LayoutClient";

type AuthLayoutProps = {
	children: ReactNode;
	params: { locale: string };
};

export default function AuthLayout({ children, params }: AuthLayoutProps) {
	return (
		<LayoutClient locale={params.locale} showSidebar={false}>
			{children}
		</LayoutClient>
	);
}

