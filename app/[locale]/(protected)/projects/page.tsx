import React from "react";

import { requireAdminAccess } from "@/shared/lib/auth-server";

type ProjectsPageProps = {
	params: { locale: string };
};

export default function ProjectsPage({ params }: ProjectsPageProps) {
	requireAdminAccess({ locale: params.locale });

	return <div>This is projects page!</div>;
}
