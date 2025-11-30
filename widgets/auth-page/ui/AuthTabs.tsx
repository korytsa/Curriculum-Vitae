"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Tabs } from "@/shared/ui";
import { useEffect, useState } from "react";

export function AuthTabs() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname?.includes("/signup") ? "signup" : "login");

  useEffect(() => {
    setActiveTab(pathname?.includes("/signup") ? "signup" : "login");
  }, [pathname]);

  const tabs = [
    {
      id: "login",
      label: t("features.authPage.tabs.login"),
      href: "/login",
    },
    {
      id: "signup",
      label: t("features.authPage.tabs.signup"),
      href: "/signup",
    },
  ];

  return (
    <nav className="flex justify-center mt-1">
      <Tabs items={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
    </nav>
  );
}
