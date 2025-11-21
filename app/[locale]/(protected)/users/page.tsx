"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchInput } from "@/shared/ui";

// Mock data
const EMPLOYEES = [
	{
		id: "1",
		firstName: "Andrei",
		lastName: "Utkin",
		email: "uas91@yandex.ru",
		technology: ".NET",
		role: "Software Engineer",
		avatar: "A",
	},
	{
		id: "2",
		firstName: "Mikalai",
		lastName: "Slimianou",
		email: "mikalai.slimianou@innowise.com",
		technology: "Angular",
		role: "Software Engineer",
		avatar: "M",
	},
	{
		id: "3",
		firstName: "Nataee",
		lastName: "Stadnik",
		email: "nwwwat312@nat.mail.ru",
		technology: "Angular",
		role: "UX Designer",
		avatar: "N",
	},
];

export default function UsersPage() {
	const { t } = useTranslation();
	const [users, setUsers] = useState(EMPLOYEES);

	return (
		<section>
			<h1 className="font-semibold text-neutral-500 mb-3">{t("users.heading")}</h1>
			<div className="w-[328px]">
			<SearchInput
				data={EMPLOYEES}
				fields={["firstName", "lastName", "email"]}
				onResults={setUsers}
				/>
			</div>
		</section>
	);
}
