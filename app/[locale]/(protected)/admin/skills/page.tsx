import { redirect } from "next/navigation";

type AdminSkillsPageProps = {
  params: { locale: string };
};

export default function AdminSkillsPage({ params }: AdminSkillsPageProps) {
  redirect(`/${params.locale}/skills`);
}
