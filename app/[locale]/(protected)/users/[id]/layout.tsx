import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { UserDetailsLayout } from "./UserDetailsLayout";

type UserDetailsRouteLayoutProps = {
  children: ReactNode;
  params: { locale: string; id: string };
};

export default function UserDetailsRouteLayout({
  children,
  params,
}: UserDetailsRouteLayoutProps) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <UserDetailsLayout locale={params.locale} userId={params.id}>
        {children}
      </UserDetailsLayout>
    </>
  );
}
