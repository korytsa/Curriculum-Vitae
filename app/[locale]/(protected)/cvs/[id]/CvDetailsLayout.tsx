"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, type TabItem, Skeleton } from "@/shared/ui";
import { useCv } from "@/features/cvs";
import { MdChevronRight } from "react-icons/md";

type CvDetailsLayoutProps = {
  children: ReactNode;
  locale: string;
  cvId: string;
};

export function CvDetailsLayout({
  children,
  locale,
  cvId,
}: CvDetailsLayoutProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { cv, loading } = useCv(cvId);
  const activeTabId = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/projects")
      ? "projects"
      : pathname?.includes("/preview")
        ? "preview"
        : "details";
  const tabs: TabItem[] = [
    {
      id: "details",
      label: t("cvs.details.tabs.details", { defaultValue: "DETAILS" }),
      href: `/cvs/${cvId}`,
    },
    {
      id: "skills",
      label: t("cvs.details.tabs.skills", { defaultValue: "SKILLS" }),
      href: `/cvs/${cvId}/skills`,
    },
    {
      id: "projects",
      label: t("cvs.details.tabs.projects", { defaultValue: "PROJECTS" }),
      href: `/cvs/${cvId}/projects`,
    },
    {
      id: "preview",
      label: t("cvs.details.tabs.preview", { defaultValue: "PREVIEW" }),
      href: `/cvs/${cvId}/preview`,
    },
  ];

  const cvName = cv?.name || null;

  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTabId)?.label ||
    t("cvs.details.tabs.details", { defaultValue: "DETAILS" });

  return (
    <section className="space-y-2">
      <header className="flex flex-wrap items-center gap-3 mt-1">
        <Link
          href={`/${locale}/cvs`}
          className="transition-colors font-semibold text-neutral-500 hover:underline"
        >
          {t("cvs.heading")}
        </Link>
        <MdChevronRight className="w-5 h-5 text-neutral-500" />
        {loading || !cv ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        ) : (
          <span className="text-red-600/80 transition-colors">{cvName}</span>
        )}
        {activeTabId !== "details" && (
          <>
            <MdChevronRight className="w-5 h-5 text-neutral-500" />
            <span className="font-semibold text-neutral-500">
              {activeTabLabel}
            </span>
          </>
        )}
      </header>

      <Tabs items={tabs} activeTabId={activeTabId} />

      <div>{children}</div>
    </section>
  );
}
