"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { locale: string } }) {
	const router = useRouter();

	useEffect(() => {
		router.push(`/${params.locale}/users`);
	}, [router, params.locale]);

	return null;
}
