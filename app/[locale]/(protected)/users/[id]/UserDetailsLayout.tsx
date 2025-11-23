"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, type TabItem } from "@/shared/ui";
import { useUser } from "@/features/users";
import { getUserFullName } from "../lib/getUserFullName";
import { TfiUser } from "react-icons/tfi";
import { MdChevronRight } from "react-icons/md";

type UserDetailsLayoutProps = {
  children: ReactNode;
  locale: string;
  userId: string;
};

export function UserDetailsLayout({
  children,
  locale,
  userId,
}: UserDetailsLayoutProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useUser(userId);
  const activeTabId = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/languages")
      ? "languages"
      : "profile";
  const tabs: TabItem[] = [
    {
      id: "profile",
      label: t("users.details.tabs.profile", { defaultValue: "Profile" }),
      href: `/users/${userId}`,
    },
    {
      id: "skills",
      label: t("users.details.tabs.skills", { defaultValue: "Skills" }),
      href: `/users/${userId}/skills`,
    },
    {
      id: "languages",
      label: t("users.details.tabs.languages", {
        defaultValue: "Languages",
      }),
      href: `/users/${userId}/languages`,
    },
  ];

  const userFullName =
    getUserFullName(user) ||
    user?.email ||
    t("users.details.unknownUser", { id: userId, defaultValue: "User {{id}}" });

  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTabId)?.label ||
    t("users.details.tabs.profile", { defaultValue: "Profile" });

  return (
    <section className="space-y-2">
      <header className="flex flex-wrap items-center gap-3 mt-1">
        <Link
          href={`/${locale}/users`}
          className="transition-colors font-semibold text-neutral-500 hover:underline"
        >
          {t("users.heading")}
        </Link>
        <MdChevronRight className="w-5 h-5 text-neutral-500" />
        <TfiUser className="w-4 h-4 text-red-600" />
        <Link
          href={`/${locale}/users/${userId}`}
          className="text-red-600 transition-colors hover:underline"
        >
          {userFullName}
        </Link>
        {activeTabId !== "profile" && (
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
