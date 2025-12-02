"use client";

import { Plus } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button, ConfirmDeleteModal, SearchInput, Table } from "@/shared/ui";
import { AddProjectModal } from "./components/AddProjectModal";
import { useCvProjectsPage } from "./lib/useCvProjectsPage";
import type { CvProjectsPageProps } from "./types";

export default function CvProjectsPageRoute({ params }: CvProjectsPageProps) {
  const { id: cvId, locale } = params;
  const { t } = useTranslation();
  const { searchInputProps, tableProps, addProjectLabel, handleAddProject, addProjectModal, deleteProjectModal } = useCvProjectsPage({
    cvId,
    locale,
  });

  return (
    <>
      <section className="pr-4">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="w-full sm:w-[325px]">
              <SearchInput {...searchInputProps} />
            </div>
          </div>
          <Button
            type="button"
            className="bg-transparent font-medium text-red-500 hover:bg-[#413535]"
            icon={<Plus className="h-5 w-5" />}
            iconPosition="left"
            onClick={handleAddProject}
          >
            {addProjectLabel}
          </Button>
        </div>
        <Table {...tableProps} />
      </section>
      <AddProjectModal
        open={addProjectModal.open}
        onClose={addProjectModal.onClose}
        projects={addProjectModal.projects}
        isProjectListLoading={addProjectModal.isLoading}
        onSubmit={addProjectModal.onSubmit}
        initialProject={addProjectModal.initialProject}
        mode={addProjectModal.mode}
      />
      <ConfirmDeleteModal
        open={deleteProjectModal.open}
        onClose={deleteProjectModal.onClose}
        onConfirm={deleteProjectModal.onConfirm}
        isLoading={deleteProjectModal.isLoading}
        errorMessage={deleteProjectModal.errorMessage}
        title={t("cvs.projectsPage.deleteModal.title")}
      >
        <p className="font-normal">
          <Trans
            i18nKey="cvs.projectsPage.deleteModal.message"
            values={{ name: deleteProjectModal.projectName ?? "" }}
            components={{ strong: <span className="font-semibold" /> }}
          />
        </p>
      </ConfirmDeleteModal>
    </>
  );
}
