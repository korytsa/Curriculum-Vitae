import React from "react";

import { requireAdminAccess } from "@/shared/lib/auth-server";

type DepartmentsPageProps = {
	params: { locale: string };
};

export default function DepartmentsPage({ params }: DepartmentsPageProps) {
	requireAdminAccess({ locale: params.locale });

	return <div>This is departments page!</div>;
}
