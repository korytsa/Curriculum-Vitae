import React from "react";

import { requireAdminAccess } from "@/shared/lib/server-auth";

type PositionsPageProps = {
	params: { locale: string };
};

export default function PositionsPage({ params }: PositionsPageProps) {
	requireAdminAccess({ locale: params.locale });

	return <div>This is positions page!</div>;
}
