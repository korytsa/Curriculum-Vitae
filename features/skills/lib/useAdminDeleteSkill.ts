"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAdminDeleteSkill as useAdminDeleteSkillMutation } from "../model/useSkillMutations";
import type { AdminSkill } from "../types";
import type { UseAdminDeleteSkillResult } from "../types";

export type { UseAdminDeleteSkillResult };

export function useAdminDeleteSkill(refetchAdminSkills: () => Promise<any>): UseAdminDeleteSkillResult {
  const { t } = useTranslation();
  const { deleteSkill: deleteSkillMutation, loading: isDeleteLoading, error: deleteError } = useAdminDeleteSkillMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [skillPendingDelete, setSkillPendingDelete] = useState<AdminSkill | null>(null);

  const handleDeleteRequest = (skill: AdminSkill) => {
    setSkillPendingDelete(skill);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSkillPendingDelete(null);
  };

  const handleConfirmDeleteSkill = async () => {
    if (!skillPendingDelete) {
      return;
    }

    await deleteSkillMutation({ skillId: skillPendingDelete.id });
    toast.success(t("admin.skills.messages.deleteSuccess"));
    handleCloseDeleteModal();
    await refetchAdminSkills();
  };

  const error = deleteError as Error | null;

  return {
    deleteSkillModal: {
      open: isDeleteModalOpen,
      onClose: handleCloseDeleteModal,
      onConfirm: handleConfirmDeleteSkill,
      skillName: skillPendingDelete?.name,
      isLoading: isDeleteLoading,
      errorMessage: error?.message ?? null,
    },
    handleDeleteRequest,
    loading: isDeleteLoading,
  };
}
