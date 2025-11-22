import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutClient } from "../LayoutClient";

type ProtectedLayoutProps = {
	children: ReactNode;
	params: { locale: string };
};

export default function ProtectedLayout({ children, params }: ProtectedLayoutProps) {
	const token = cookies().get("access_token")?.value;

	if (!token) {
		redirect(`/${params.locale}/login`);
	}

	return (
		<LayoutClient locale={params.locale} showSidebar>
			{children}
		</LayoutClient>
	);
}

