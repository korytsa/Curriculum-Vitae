"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button, ConfirmDeleteModal, SearchInput, Table } from "@/shared/ui";
import { useCvsPage } from "./lib/useCvsPage";
import { CreateCvModal, useCvs, useDeleteCv } from "@/features/cvs";

export default function CvsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    cvId: string;
    cvName?: string;
  }>({ open: false, cvId: "" });

  const { cvs } = useCvs();
  const { deleteCv, loading: isDeleteLoading, error: deleteError } = useDeleteCv();

  const handleCloseModal = () => setShowCreateModal(false);

  const handleCreated = async () => {
    setShowCreateModal(false);
  };

  const handleDetails = (cvId: string) => {
    router.push(`/${locale}/cvs/${cvId}`);
  };

  const handleDelete = (cvId: string) => {
    const cv = cvs.find((c) => c.id === cvId);
    setDeleteModalState({
      open: true,
      cvId,
      cvName: cv?.name,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({ open: false, cvId: "", cvName: undefined });
  };

  const handleDeleteSuccess = async () => {
    await refetch?.();
    toast.success(
      t("cvs.deleteModal.notifications.success", {
        defaultValue: "CV deleted successfully",
      })
    );
  };

  const handleConfirmDeleteCv = async () => {
    if (!deleteModalState.cvId) {
      return;
    }

    await deleteCv({ cvId: deleteModalState.cvId });
    await handleDeleteSuccess();
    handleCloseDeleteModal();
  };

  const { heading, searchInputProps, tableProps, refetch } = useCvsPage({
    onDetails: handleDetails,
    onDelete: handleDelete,
  });

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>
            <div className="w-full sm:w-[325px]">
              <SearchInput {...searchInputProps} />
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="rounded-full px-6 py-2 text-red-400 hover:text-red-200 uppercase tracking-[0.3em] text-xs"
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => setShowCreateModal(true)}
          >
            {t("cvs.actions.create", { defaultValue: "Create CV" })}
          </Button>
        </div>

        <Table {...tableProps} />
      </section>

      <CreateCvModal open={showCreateModal} onClose={handleCloseModal} onSuccess={handleCreated} />

      <ConfirmDeleteModal
        open={deleteModalState.open}
        title={t("cvs.deleteModal.title", { defaultValue: "Delete CV" })}
        onConfirm={handleConfirmDeleteCv}
        onClose={handleCloseDeleteModal}
        isLoading={isDeleteLoading}
        errorMessage={deleteError?.message ?? null}
      >
        <p className="font-normal">
          <Trans
            i18nKey="cvs.deleteModal.warning"
            values={{ name: deleteModalState.cvName || "" }}
            components={{ strong: <span className="font-semibold" /> }}
            defaultValue="Are you sure you want to delete CV <strong>{{name}}</strong>?"
          />
        </p>
      </ConfirmDeleteModal>
    </>
  );
}
