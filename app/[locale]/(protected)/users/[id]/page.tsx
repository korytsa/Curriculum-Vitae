"use client";

import { useParams } from "next/navigation";

export default function UserDetailsPage() {
	const params = useParams();
	const idParam =
		typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

	return (
		<section className="py-10 space-y-3">
			<p className="text-lg font-semibold text-white">This is profile page</p>
			{Boolean(idParam) && <p className="text-white/70 break-all">{idParam}</p>}
		</section>
	);
}


