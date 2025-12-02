"use client";

import { ProjectsPageLayout } from "@/features/projects";
import { AddProjectModal } from "./components/AddProjectModal";
import { useCvProjectsPage } from "./lib/useCvProjectsPage";
import type { CvProjectsPageProps } from "@/features/projects";

export default function CvProjectsPageRoute({ params }: CvProjectsPageProps) {
  const { id: cvId, locale } = params;
  const { searchInputProps, tableProps, addProjectLabel, handleAddProject, addProjectModal, deleteProjectModal } = useCvProjectsPage({
    cvId,
    locale,
  });

  return (
    <ProjectsPageLayout
      searchInputProps={searchInputProps}
      tableProps={tableProps}
      addProjectLabel={addProjectLabel}
      onAddProject={handleAddProject}
      deleteModal={deleteProjectModal}
      renderModal={() => (
        <AddProjectModal
          open={addProjectModal.open}
          onClose={addProjectModal.onClose}
          projects={addProjectModal.projects}
          isProjectListLoading={addProjectModal.isLoading}
          onSubmit={addProjectModal.onSubmit}
          initialProject={addProjectModal.initialProject}
          mode={addProjectModal.mode}
        />
      )}
    />
  );
}
