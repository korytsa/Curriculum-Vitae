"use client";

import { useState } from "react";
import { useDeleteProject as useDeleteProjectMutation } from "@/features/projects";
import { useRemoveCvProject } from "@/features/cvs";
import type { CvProject } from "@/shared/graphql/generated";
import type { UseDeleteProjectParams, UseDeleteProjectResult } from "@/features/projects";

export function useDeleteProject({ cvId }: UseDeleteProjectParams = {}): UseDeleteProjectResult {
  const { deleteProject: deleteRegularProject, loading: isDeleteLoading, error: deleteError } = useDeleteProjectMutation();
  const { removeCvProject, loading: isRemoveCvLoading, error: removeCvError } = useRemoveCvProject(cvId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectPendingDelete, setProjectPendingDelete] = useState<CvProject | null>(null);

  const deleteProject = async (projectId: string, isCvProject = false) => {
    if (isCvProject && cvId) {
      await removeCvProject({ projectId });
    } else {
      await deleteRegularProject({ projectId });
    }
  };

  const handleDeleteRequest = (project: CvProject) => {
    setProjectPendingDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectPendingDelete(null);
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectPendingDelete) {
      return;
    }

    const projectId = projectPendingDelete.project?.id ?? projectPendingDelete.id;

    if (!projectId) {
      return;
    }

    const isCvProject = !!cvId;
    await deleteProject(projectId, isCvProject);
    handleCloseDeleteModal();
  };

  const loading = cvId ? isRemoveCvLoading : isDeleteLoading;
  const error = (cvId ? removeCvError : deleteError) as Error | null;

  return {
    deleteProject,
    loading,
    error,
    deleteProjectModal: {
      open: isDeleteModalOpen,
      onClose: handleCloseDeleteModal,
      onConfirm: handleConfirmDeleteProject,
      projectName: projectPendingDelete?.name,
      isLoading: loading,
      errorMessage: error?.message ?? null,
    },
    handleDeleteRequest,
  };
}
