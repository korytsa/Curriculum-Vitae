"use client";

import { Trans, useTranslation } from "react-i18next";
import { ConfirmDeleteModal } from "@/shared/ui";
import { AdminSkillsPageView } from "@/app/[locale]/(protected)/skills/ui/AdminSkillsPageView";
import { AdminSkillModal } from "./AdminSkillModal";
import { useAdminSkillsPage } from "../../lib/useAdminSkillsPage";

export function AdminSkillsPageContainer() {
  const { t } = useTranslation();
  const { searchInputProps, tableProps, heading, createButtonLabel, handleOpenCreateForm, createModal, updateModal, deleteSkillModal } = useAdminSkillsPage();

  const isModalOpen = createModal.open || updateModal.open;
  const currentModal = createModal.open ? createModal : updateModal;
  const mode = createModal.open ? "create" : "update";

  return (
    <>
      <AdminSkillsPageView
        heading={heading}
        createButtonLabel={createButtonLabel}
        searchInputProps={searchInputProps}
        onOpenCreateForm={handleOpenCreateForm}
        tableProps={tableProps}
      />

      <AdminSkillModal
        open={isModalOpen}
        onClose={currentModal.onClose}
        mode={mode}
        formState={currentModal.formState}
        onFieldChange={currentModal.onFieldChange}
        onSubmit={currentModal.onSubmit}
        isLoading={currentModal.isLoading}
        isValid={currentModal.isValid}
      />

      <ConfirmDeleteModal
        open={deleteSkillModal.open}
        onClose={deleteSkillModal.onClose}
        onConfirm={deleteSkillModal.onConfirm}
        isLoading={deleteSkillModal.isLoading}
        errorMessage={deleteSkillModal.errorMessage}
        title={t("admin.skills.deleteModal.title")}
      >
        <p className="font-normal">
          <Trans i18nKey="admin.skills.deleteModal.message" values={{ name: deleteSkillModal.skillName ?? "" }} components={{ strong: <span className="font-semibold" /> }} />
        </p>
      </ConfirmDeleteModal>
    </>
  );
}

