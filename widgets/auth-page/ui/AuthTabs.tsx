"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Tabs } from "@/shared/ui";
import { useState } from "react";

	const tabs = [
		{
			id: "login",
			label: "LOG IN",
      href: "/login",
		},
		{
			id: "signup",
			label: "SIGN UP",
      href: "/signup",
			},
	];  

export function AuthTabs() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname?.includes("/login") ? "login" : "signup");

  return (
    <nav className="flex justify-center mt-1">
      <Tabs items={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
    </nav>
  );
}

