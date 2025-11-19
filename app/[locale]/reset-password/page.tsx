import { ResetPasswordForm } from "@/features/reset-password";

type ResetPasswordPageProps = {
	params: { locale: string };
	searchParams: { token?: string };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
	const tokenParam = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token ?? null;

	return <ResetPasswordForm token={tokenParam} />;
}


