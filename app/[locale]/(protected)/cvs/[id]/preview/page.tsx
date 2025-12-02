"use client";

import { Loader } from "@/shared/ui";
import { useCv } from "@/features/cvs";
import PreviewHeaderSection from "./components/cv-sections/PreviewHeaderSection";
import PreviewDetailsSection from "./components/cv-sections/PreviewDetailsSection";
import PreviewProjectsSection from "./components/cv-sections/PreviewProjectsSection";
import PreviewSkillsSection from "./components/cv-sections/PreviewSkillsSection";
import type { CvPreviewPageProps } from "./types";

export default function CvPreviewPage({ params }: CvPreviewPageProps) {
  const { id } = params;
  const { cv, loading } = useCv(id);

  if (loading && !cv) {
    return (
      <div className="mt-20 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-8 mx-auto max-w-4xl space-y-12">
      <PreviewHeaderSection />
      <PreviewDetailsSection />
      <PreviewProjectsSection />
      <PreviewSkillsSection />
    </div>
  );
}
