"use client";

import { ProjectsPageLayout, ProjectModal, useCvProjectsPage } from "@/features/projects";
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
        <ProjectModal
          variant="add-to-cv"
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
