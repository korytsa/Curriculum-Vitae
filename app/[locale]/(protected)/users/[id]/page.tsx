import { UserProfileDetails } from "@/features/users/ui/UserProfileDetails";

type UserProfilePageProps = {
  params: { locale: string; id: string };
};

export default function UserProfilePage({ params }: UserProfilePageProps) {
  return <UserProfileDetails userId={params.id} locale={params.locale} />;
}
