import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { CvDetailsLayout } from "./CvDetailsLayout";

type CvDetailsRouteLayoutProps = {
  children: ReactNode;
  params: { locale: string; id: string };
};

export default function CvDetailsRouteLayout({
  children,
  params,
}: CvDetailsRouteLayoutProps) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <CvDetailsLayout locale={params.locale} cvId={params.id}>
        {children}
      </CvDetailsLayout>
    </>
  );
}
