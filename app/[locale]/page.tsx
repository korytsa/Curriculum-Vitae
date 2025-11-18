<<<<<<< HEAD
import { redirect } from 'next/navigation'

export default function Home({
  params,
}: {
  params: { locale: string }
}) {
  redirect(`/${params.locale}/login`)
=======
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { locale: string } }) {
	const router = useRouter();

	useEffect(() => {
		router.push(`/${params.locale}/users`);
	}, [router, params.locale]);

	return null;
>>>>>>> dfda69db038178d758e0e042f5ca22831afdc8a9
}
