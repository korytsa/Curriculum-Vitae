"use client";

import { useState } from "react";
import type { CvProject } from "@/shared/graphql/generated";

export type DeleteProjectModalState = {
  open: boolean;
  projectName?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
};

export type UseDeleteProjectModalParams = {
  onDelete: (projectId: string) => Promise<void>;
  loading: boolean;
  error?: Error | null;
};

export function useDeleteProjectModal({ onDelete, loading, error }: UseDeleteProjectModalParams) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectPendingDelete, setProjectPendingDelete] = useState<CvProject | null>(null);

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

    await onDelete(projectId);
    handleCloseDeleteModal();
  };

  return {
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
