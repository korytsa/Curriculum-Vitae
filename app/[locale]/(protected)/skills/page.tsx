"use client";

import { SkillsPageContainer } from "@/features/skills";
import { AdminSkillsPageContainer } from "@/features/skills";
import { useIsAdmin } from "@/shared/lib";

export default function SkillsPage() {
  const admin = useIsAdmin();
  if (admin) {
    return <AdminSkillsPageContainer />;
  }
  return <SkillsPageContainer />;
}
