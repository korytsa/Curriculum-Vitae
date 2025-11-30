"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Input, Select } from "@/shared/ui";
import { useUserDirectories } from "@/features/users/model/useUserDirectories";
import { useUpdateUserProfile } from "@/features/users/model/useUpdateUserProfile";
import type { User } from "../types";
import type { UpdateUserInput, UserRole } from "@/shared/graphql/generated";
import { ProfileNameDirectoryFields } from "@/features/users/ui/ProfileNameDirectoryFields";
import {
  NO_SELECTION_VALUE,
  buildDirectoryChanges,
  buildDirectoryOptions,
  buildInputChangeHandler,
  buildProfileChanges,
  buildSelectChangeHandler,
  createInitialFormValues,
  mergeOptionsWithActiveValue,
  type ProfileFormValues,
} from "@/features/users/ui/utils";

interface UpdateUserModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export default function UpdateUserModal({ user, open, onClose }: UpdateUserModalProps) {
  const { t } = useTranslation();
  const { departments, positions, loading: directoriesLoading } = useUserDirectories();
  const { updateProfile, updateUser, loading } = useUpdateUserProfile(user.id);

  const [formValues, setFormValues] = useState<ProfileFormValues>(() => createInitialFormValues(user));
  const [role, setRole] = useState<UserRole | "">(((user as any).role as UserRole | "") || "Employee");
  const handleInputChange = buildInputChangeHandler(setFormValues);
  const handleSelectChange = buildSelectChangeHandler(setFormValues);

  useEffect(() => {
    if (open) {
      setFormValues(createInitialFormValues(user));
      setRole((((user as any).role as UserRole | "") || "Employee") as UserRole);
    }
  }, [open, user]);

  const notProvidedLabel = t("users.details.profile.selects.notProvided");
  const departmentOptions = mergeOptionsWithActiveValue(
    buildDirectoryOptions(departments, t("users.details.profile.selects.departmentPlaceholder"), notProvidedLabel),
    formValues.departmentId,
    user.department
  );
  const positionOptions = mergeOptionsWithActiveValue(
    buildDirectoryOptions(positions, t("users.details.profile.selects.positionPlaceholder"), notProvidedLabel),
    formValues.positionId,
    user.position
  );

  const roleOptions = [
    { label: t("features.createUserForm.roles.employee"), value: "Employee" },
    { label: t("features.createUserForm.roles.admin"), value: "Admin" },
  ];

  const handleSubmit = async () => {
    const profileChanges = buildProfileChanges(user, formValues);
    const directoryChanges = buildDirectoryChanges(user, formValues);
    const originalRole = (((user as any).role as UserRole | "") || "Employee") as UserRole | "";

    const userChanges: Partial<Omit<UpdateUserInput, "userId">> = {};
    if (directoryChanges) {
      userChanges.departmentId = directoryChanges.departmentId;
      userChanges.positionId = directoryChanges.positionId;
    }
    if (role !== originalRole) {
      userChanges.role = role || undefined;
    }

    const mutations: Promise<unknown>[] = [];
    if (profileChanges) {
      mutations.push(updateProfile(profileChanges));
    }
    if (Object.keys(userChanges).length > 0) {
      mutations.push(updateUser(userChanges));
    }

    if (mutations.length > 0) {
      await Promise.all(mutations);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("users.actions.update")}
      primaryAction={{
        label: t("users.details.profile.actions.update"),
        onClick: handleSubmit,
        disabled: loading || directoriesLoading,
      }}
      secondaryAction={{
        label: t("confirmDeleteModal.actions.cancel"),
        onClick: onClose,
      }}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input id="email" name="email" type="email" label={t("users.details.profile.fields.email")} value={user.email} readOnly />
        <Input id="password" name="password" type="text" label={t("features.createUserForm.labels.password")} value="**********" readOnly hidePasswordToggle />
        <div className="md:col-span-2">
          <ProfileNameDirectoryFields
            firstNameField={{
              id: "firstName",
              name: "firstName",
              value: formValues.firstName,
              onChange: handleInputChange("firstName"),
              label: t("users.details.profile.fields.firstName"),
            }}
            lastNameField={{
              id: "lastName",
              name: "lastName",
              value: formValues.lastName,
              onChange: handleInputChange("lastName"),
              label: t("users.details.profile.fields.lastName"),
            }}
            departmentField={{
              label: t("users.details.profile.fields.department"),
              options: departmentOptions,
              value: formValues.departmentId || NO_SELECTION_VALUE,
              onChange: handleSelectChange("departmentId"),
              disabled: directoriesLoading,
            }}
            positionField={{
              label: t("users.details.profile.fields.position"),
              options: positionOptions,
              value: formValues.positionId || NO_SELECTION_VALUE,
              onChange: handleSelectChange("positionId"),
              disabled: directoriesLoading,
            }}
          />
        </div>
        <Select label={t("features.createUserForm.labels.role")} options={roleOptions} value={role} onChange={(value) => setRole(value as UserRole)} readOnly />
      </div>
    </Modal>
  );
}
