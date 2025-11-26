"use client";

import { useState, useEffect } from "react";
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

export default function UpdateUserModal({
  user,
  open,
  onClose,
}: UpdateUserModalProps) {
  const {
    departments,
    positions,
    loading: directoriesLoading,
  } = useUserDirectories();
  const { updateProfile, updateUser, loading } = useUpdateUserProfile(user.id);

  const [formValues, setFormValues] = useState<ProfileFormValues>(() =>
    createInitialFormValues(user)
  );
  const [role, setRole] = useState<UserRole | "">(
    ((user as any).role as UserRole | "") || "Employee"
  );
  const handleInputChange = buildInputChangeHandler(setFormValues);
  const handleSelectChange = buildSelectChangeHandler(setFormValues);

  useEffect(() => {
    if (open) {
      setFormValues(createInitialFormValues(user));
      setRole(
        (((user as any).role as UserRole | "") || "Employee") as UserRole
      );
    }
  }, [open, user]);

  const notProvidedLabel = "Not specified";
  const departmentOptions = mergeOptionsWithActiveValue(
    buildDirectoryOptions(departments, "Department", notProvidedLabel),
    formValues.departmentId,
    user.department
  );
  const positionOptions = mergeOptionsWithActiveValue(
    buildDirectoryOptions(positions, "Position", notProvidedLabel),
    formValues.positionId,
    user.position
  );

  const roleOptions = [
    { label: "Employee", value: "Employee" },
    { label: "Admin", value: "Admin" },
  ];

  const handleSubmit = async () => {
    try {
      const profileChanges = buildProfileChanges(user, formValues);
      const directoryChanges = buildDirectoryChanges(user, formValues);
      const originalRole = (((user as any).role as UserRole | "") ||
        "Employee") as UserRole | "";

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
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update user"
      primaryAction={{
        label: "Update",
        onClick: handleSubmit,
        disabled: loading || directoriesLoading,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={user.email}
            readOnly
          />
        </div>
        <div>
          <Input
            id="password"
            name="password"
            type="text"
            label="Password"
            value="**********"
            readOnly
            hidePasswordToggle
          />
        </div>
        <div className="md:col-span-2">
          <ProfileNameDirectoryFields
            firstNameField={{
              id: "firstName",
              name: "firstName",
              value: formValues.firstName,
              onChange: handleInputChange("firstName"),
              label: "First Name",
            }}
            lastNameField={{
              id: "lastName",
              name: "lastName",
              value: formValues.lastName,
              onChange: handleInputChange("lastName"),
              label: "Last Name",
            }}
            departmentField={{
              label: "Department",
              options: departmentOptions,
              value: formValues.departmentId || NO_SELECTION_VALUE,
              onChange: handleSelectChange("departmentId"),
              disabled: directoriesLoading,
            }}
            positionField={{
              label: "Position",
              options: positionOptions,
              value: formValues.positionId || NO_SELECTION_VALUE,
              onChange: handleSelectChange("positionId"),
              disabled: directoriesLoading,
            }}
          />
        </div>
        <div>
          <Select
            label="Role"
            options={roleOptions}
            value={role}
            onChange={(value) => setRole(value as UserRole)}
            readOnly
          />
        </div>
      </div>
    </Modal>
  );
}
