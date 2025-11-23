"use client";

import { useApolloClient } from "@apollo/client/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { PiUploadSimpleBold } from "react-icons/pi";
import { Avatar, Button, Input, Loader, Select } from "@/shared/ui";
import { useUser } from "@/features/users";
import { getAvatarFallback } from "@/features/users/lib/getAvatarFallback";
import { getUserFullName } from "@/app/[locale]/(protected)/users/lib/getUserFullName";
import { useUserDirectories } from "@/features/users/model/useUserDirectories";
import { useUpdateUserProfile } from "@/features/users/model/useUpdateUserProfile";
import {
  NO_SELECTION_VALUE,
  buildDirectoryOptions,
  mergeOptionsWithActiveValue,
  formatMemberSince,
  createInitialFormValues,
  buildProfileChanges,
  buildDirectoryChanges,
  getProfileFormState,
  executeProfileMutations,
  buildAvatarHandlers,
  buildInputChangeHandler,
  buildSelectChangeHandler,
  type ProfileFormValues,
} from "./utils";
import {
  AVATAR_ACCEPT_ATTRIBUTE,
  AVATAR_SIZE_ERROR_FALLBACK,
  MAX_AVATAR_SIZE_LABEL,
} from "./constants";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";

type UserProfileDetailsProps = {
  userId: string;
  locale?: string;
};

export function UserProfileDetails({
  userId,
  locale,
}: UserProfileDetailsProps) {
  const { t } = useTranslation();
  const client = useApolloClient();
  const { user, loading, refetch } = useUser(userId);
  const {
    departments,
    positions,
    loading: directoriesLoading,
  } = useUserDirectories();
  const {
    updateProfile,
    updateUser,
    uploadAvatar,
    loading: mutationLoading,
  } = useUpdateUserProfile(userId);
  const accessToken = accessTokenVar();
  const decodedToken = accessToken ? decodeToken(accessToken) : null;
  const canEditProfile = decodedToken?.sub?.toString() === userId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>(
    createInitialFormValues()
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifyAvatarSizeError = () => {
    const fallbackMessage = AVATAR_SIZE_ERROR_FALLBACK;
    toast.error(
      t("users.details.profile.upload.maxSize", {
        size: MAX_AVATAR_SIZE_LABEL,
        defaultValue: fallbackMessage,
      }) || fallbackMessage
    );
  };

  const { handleAvatarClick, handleFileChange } = buildAvatarHandlers({
    fileInputRef,
    avatarPreviewUrl,
    setAvatarFile,
    setSelectedAvatarName,
    setAvatarPreviewUrl,
    onAvatarTooLarge: notifyAvatarSizeError,
  });

  const handleInputChange = buildInputChangeHandler(setFormValues);
  const handleSelectChange = buildSelectChangeHandler(setFormValues);

  useEffect(() => {
    if (!user) return;
    setFormValues(createInitialFormValues(user));
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const notProvidedLabel = t("users.details.profile.selects.notProvided", {
    defaultValue: "Not specified",
  });
  const departmentOptions = buildDirectoryOptions(
    departments,
    t("users.details.profile.selects.departmentPlaceholder", {
      defaultValue: "Department",
    }),
    notProvidedLabel
  );
  const positionOptions = buildDirectoryOptions(
    positions,
    t("users.details.profile.selects.positionPlaceholder", {
      defaultValue: "Position",
    }),
    notProvidedLabel
  );

  const memberSinceText = formatMemberSince(user?.created_at, locale);
  const isInitialLoading = loading && !user;

  const profileChanges = buildProfileChanges(user, formValues);
  const directoryChanges = buildDirectoryChanges(user, formValues);
  const avatarChanged = Boolean(avatarFile);

  const { isPristine, canSubmit } = getProfileFormState({
    user,
    profileChanges,
    directoryChanges,
    avatarChanged,
    mutationLoading,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || isPristine || !canEditProfile) return;

    setIsSubmitting(true);

    try {
      await executeProfileMutations({
        profileChanges,
        directoryChanges,
        avatarFile,
        updateProfile,
        updateUser,
        uploadAvatar,
      });
      await Promise.all([
        refetch(),
        client.refetchQueries({ include: ["Users"] }),
      ]);

      resetAvatarState();
      toast.success(
        t("users.details.profile.notifications.success", {
          defaultValue: "Profile updated successfully.",
        })
      );
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("users.details.profile.notifications.error", {
              defaultValue: "Unable to update profile.",
            })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullName = user ? getUserFullName(user) || user.email : null;

  const avatarSource = avatarPreviewUrl || user?.profile.avatar || undefined;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Loader size="lg" className="text-red-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#3b3b3b] p-6 text-sm text-neutral-400">
        {t("users.details.profile.empty")}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-14 mt-8 md:w-[840px] mx-auto"
    >
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="flex items-center sm:flex-row flex-col gap-16">
          <Avatar
            size="lg"
            className="h-28 w-28 text-3xl"
            src={avatarSource}
            alt={fullName || user.email}
            fallback={getAvatarFallback({
              firstName: user.profile.first_name,
              email: user.email,
            })}
          />
          {canEditProfile && (
            <>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="inline-flex items-center gap-3 text-xl font-semibold text-white"
                >
                  <PiUploadSimpleBold className="h-7 w-7" />
                  {t("users.details.profile.upload.button")}
                </button>
                <p className="text-neutral-400 font-semibold">
                  {t("users.details.profile.upload.hint")}
                </p>
                {selectedAvatarName && (
                  <p className="text-xs text-neutral-400">
                    {t("users.details.profile.upload.selected", {
                      file: selectedAvatarName,
                    })}
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={AVATAR_ACCEPT_ATTRIBUTE}
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
        <div className="space-y-2">
          <h2 className="sm:text-2xl font-semibold text-white">
            {fullName || user.email}
          </h2>
          <p className="text-sm text-neutral-300">{user.email}</p>
          {memberSinceText && (
            <p className="text-sm sm:text-md">
              {t("users.details.profile.memberSince", {
                date: memberSinceText,
              })}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <Input
            value={formValues.firstName}
            onChange={
              canEditProfile ? handleInputChange("firstName") : undefined
            }
            label={t("users.details.profile.fields.firstName")}
            placeholder={t("users.details.profile.fields.firstName")}
            readOnly={!canEditProfile}
          />
          <Input
            value={formValues.lastName}
            onChange={
              canEditProfile ? handleInputChange("lastName") : undefined
            }
            label={t("users.details.profile.fields.lastName")}
            placeholder={t("users.details.profile.fields.lastName")}
            readOnly={!canEditProfile}
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Select
            options={mergeOptionsWithActiveValue(
              departmentOptions,
              formValues.departmentId,
              user.department
            )}
            value={formValues.departmentId || NO_SELECTION_VALUE}
            onChange={
              canEditProfile ? handleSelectChange("departmentId") : undefined
            }
            label={t("users.details.profile.fields.department")}
            disabled={directoriesLoading}
            readOnly={!canEditProfile}
          />
          <Select
            options={mergeOptionsWithActiveValue(
              positionOptions,
              formValues.positionId,
              user.position
            )}
            value={formValues.positionId || NO_SELECTION_VALUE}
            onChange={
              canEditProfile ? handleSelectChange("positionId") : undefined
            }
            label={t("users.details.profile.fields.position")}
            disabled={directoriesLoading}
            readOnly={!canEditProfile}
          />
        </div>
        {canEditProfile && (
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="danger"
              className="w-[400px] disabled:bg-[#666565] font-normal"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting
                ? t("users.details.profile.actions.update", {
                    defaultValue: "Update",
                  }) + "..."
                : t("users.details.profile.actions.update")}
            </Button>
          </div>
        )}
      </div>
    </form>
  );

  function resetAvatarState() {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setSelectedAvatarName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
}
