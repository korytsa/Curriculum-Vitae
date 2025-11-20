"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui";

export function AuthTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const isLoginPage = pathname?.includes("/login");
  const { t } = useTranslation();

  const baseClass =
    'relative text-sm font-semibold uppercase tracking-wide transition-colors pb-3 px-4 after:content-[""] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5';

  return (
    <nav className="flex justify-center gap-12 pt-8 pb-4">
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          router.push(`/${locale}/login`);
        }}
        className={
          isLoginPage
            ? `${baseClass} text-red-500 after:bg-red-500 after:w-[170%]`
            : `${baseClass} text-white hover:text-gray-300 after:w-0`
        }
      >
        {t("features.authPage.tabs.login")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          router.push(`/${locale}/signup`);
        }}
        className={
          !isLoginPage
            ? `${baseClass} text-red-500 after:bg-red-500 after:w-[170%]`
            : `${baseClass} text-white hover:text-gray-300 after:w-0`
        }
      >
        {t("features.authPage.tabs.signup")}
      </Button>
    </nav>
  );
}

