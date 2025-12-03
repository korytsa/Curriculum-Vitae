"use client";

import { useTranslation } from "react-i18next";
import { ProjectsPageLayout, ProjectModal, useProjectsPage } from "@/features/projects";
import type { ProjectsPageProps } from "@/features/projects";

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = params;
  const { t } = useTranslation();
  const { searchInputProps, tableProps, addProjectLabel, handleAddProject, createProjectModal, deleteProjectModal } = useProjectsPage({
    locale,
  });

  return (
    <ProjectsPageLayout
      searchInputProps={searchInputProps}
      tableProps={tableProps}
      addProjectLabel={addProjectLabel}
      onAddProject={handleAddProject}
      deleteModal={deleteProjectModal}
      heading={t("projectsHeading")}
      renderModal={() => (
        <ProjectModal
          variant="create"
          open={createProjectModal.open}
          onClose={createProjectModal.onClose}
          onSubmit={createProjectModal.onSubmit}
          initialProject={createProjectModal.initialProject}
          mode={createProjectModal.mode}
        />
      )}
    />
  );
}
