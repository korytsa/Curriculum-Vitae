"use client";

import { CreateUserForm } from "@/features/create-user-form";

export default function CreateUserPage() {
	return (
		<div className="min-h-screen bg-[#0F0F0F] px-4 py-12">
			<div className="w-full max-w-4xl mx-auto">
				<CreateUserForm />
			</div>
		</div>
	);
}
