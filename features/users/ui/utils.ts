import type {
  DirectoryInfo,
  User,
} from "@/app/[locale]/(protected)/users/types";
import type {
  UpdateProfileInput,
  UpdateUserInput,
  UploadAvatarInput,
} from "@/shared/graphql/generated";
import type { SelectOption } from "@/shared/ui";
import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import { MAX_AVATAR_BYTES } from "./constants";

export const NO_SELECTION_VALUE = "__none__";

type DirectoryOption = Pick<DirectoryInfo, "id" | "name">;

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
};

type ProfileChanges = Pick<
  UpdateProfileInput,
  "first_name" | "last_name"
> | null;
type DirectoryChanges = Pick<
  UpdateUserInput,
  "departmentId" | "positionId"
> | null;

type ExecuteProfileMutationsParams = {
  profileChanges: ProfileChanges;
  directoryChanges: DirectoryChanges;
  avatarFile: File | null;
  updateProfile: (profile: NonNullable<ProfileChanges>) => Promise<unknown>;
  updateUser: (user: NonNullable<DirectoryChanges>) => Promise<unknown>;
  uploadAvatar: (avatar: Omit<UploadAvatarInput, "userId">) => Promise<unknown>;
};

type GetProfileFormStateParams = {
  user: User | null | undefined;
  profileChanges: ProfileChanges;
  directoryChanges: DirectoryChanges;
  avatarChanged: boolean;
  mutationLoading: boolean;
};

export function isAvatarSizeValid(
  file: File,
  maxBytes: number = MAX_AVATAR_BYTES
) {
  return file.size <= maxBytes;
}

export function createInitialFormValues(user?: User | null): ProfileFormValues {
  return {
    firstName: user?.profile.first_name || "",
    lastName: user?.profile.last_name || "",
    departmentId: user?.department?.id || "",
    positionId: user?.position?.id || "",
  };
}

export function buildDirectoryOptions(
  directories: DirectoryOption[],
  fallbackLabel: string,
  notProvidedLabel: string
): SelectOption[] {
  const placeholderLabel = fallbackLabel
    ? `${notProvidedLabel} (${fallbackLabel})`
    : notProvidedLabel;

  const options: SelectOption[] = [
    {
      value: NO_SELECTION_VALUE,
      label: placeholderLabel,
    },
  ];

  const seen = new Set<string>();
  directories.forEach((directory) => {
    if (!directory.id || seen.has(directory.id)) return;
    seen.add(directory.id);
    options.push({
      value: directory.id,
      label: directory.name,
    });
  });

  return options;
}

export function mergeOptionsWithActiveValue(
  options: SelectOption[],
  activeValue: string,
  fallback?: DirectoryOption | null
) {
  if (!activeValue) {
    return options;
  }

  const hasActiveOption = options.some(
    (option) => option.value === activeValue
  );
  if (hasActiveOption) {
    return options;
  }

  const fallbackLabel =
    fallback?.name || (fallback ? `ID: ${fallback.id}` : `ID: ${activeValue}`);

  return [
    ...options,
    {
      value: activeValue,
      label: fallbackLabel,
    },
  ];
}

export function buildProfileChanges(
  user: User | null | undefined,
  values: ProfileFormValues
): ProfileChanges {
  if (!user) return null;

  const normalizedFirst = values.firstName.trim();
  const normalizedLast = values.lastName.trim();

  const originalFirst = user.profile.first_name?.trim() || "";
  const originalLast = user.profile.last_name?.trim() || "";

  if (normalizedFirst === originalFirst && normalizedLast === originalLast) {
    return null;
  }

  return {
    first_name: normalizedFirst || null,
    last_name: normalizedLast || null,
  };
}

export function buildDirectoryChanges(
  user: User | null | undefined,
  values: ProfileFormValues
): DirectoryChanges {
  if (!user) return null;

  const originalDepartmentId = user.department?.id || "";
  const originalPositionId = user.position?.id || "";

  const departmentChanged = values.departmentId !== originalDepartmentId;
  const positionChanged = values.positionId !== originalPositionId;

  if (!departmentChanged && !positionChanged) {
    return null;
  }

  return {
    departmentId: values.departmentId || null,
    positionId: values.positionId || null,
  };
}

export function getProfileFormState({
  user,
  profileChanges,
  directoryChanges,
  avatarChanged,
  mutationLoading,
}: GetProfileFormStateParams) {
  const isPristine =
    !user || (!profileChanges && !directoryChanges && !avatarChanged);

  return {
    isPristine,
    canSubmit: !isPristine && !mutationLoading,
  };
}

export async function executeProfileMutations({
  profileChanges,
  directoryChanges,
  avatarFile,
  updateProfile,
  updateUser,
  uploadAvatar,
}: ExecuteProfileMutationsParams) {
  const mutations: Array<Promise<unknown>> = [];

  if (profileChanges) {
    mutations.push(updateProfile(profileChanges));
  }

  if (directoryChanges) {
    mutations.push(updateUser(directoryChanges));
  }

  if (avatarFile) {
    const base64 = await fileToBase64(avatarFile);
    mutations.push(
      uploadAvatar({
        base64,
        size: avatarFile.size,
        type: avatarFile.type,
      })
    );
  }

  if (mutations.length === 0) {
    return;
  }

  await Promise.all(mutations);
}

type BuildAvatarHandlersParams = {
  fileInputRef: RefObject<HTMLInputElement>;
  avatarPreviewUrl: string | null;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
  setSelectedAvatarName: Dispatch<SetStateAction<string | null>>;
  setAvatarPreviewUrl: Dispatch<SetStateAction<string | null>>;
  onAvatarTooLarge: () => void;
};

export function buildAvatarHandlers({
  fileInputRef,
  avatarPreviewUrl,
  setAvatarFile,
  setSelectedAvatarName,
  setAvatarPreviewUrl,
  onAvatarTooLarge,
}: BuildAvatarHandlersParams) {
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAvatarSizeValid(file)) {
      onAvatarTooLarge();
      event.target.value = "";
      return;
    }

    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarFile(file);
    setSelectedAvatarName(file.name);
    setAvatarPreviewUrl(URL.createObjectURL(file));
  };

  return {
    handleAvatarClick,
    handleFileChange,
  };
}

type SetFormValues = Dispatch<SetStateAction<ProfileFormValues>>;

export function buildInputChangeHandler(setFormValues: SetFormValues) {
  return (field: keyof ProfileFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [field]: value }));
    };
}

export function buildSelectChangeHandler(setFormValues: SetFormValues) {
  return (field: keyof ProfileFormValues) => (value: string) => {
    const shouldReset = value === NO_SELECTION_VALUE;
    setFormValues((prev) => ({
      ...prev,
      [field]: shouldReset ? "" : value,
    }));
  };
}

export function formatMemberSince(
  dateInput?: string | number | null,
  locale?: string
) {
  if (dateInput == null) return null;

  const parseDate = (value: string | number): Date | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
      const timestamp = value < 1e12 ? value * 1000 : value;
      const date = new Date(timestamp);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const numeric = Number(trimmed);
      if (Number.isFinite(numeric)) {
        return parseDate(numeric);
      }
      const date = new Date(trimmed);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  };

  const date = parseDate(dateInput);
  if (!date) return null;

  const formatterLocale = (() => {
    if (!locale) return undefined;
    const normalized = locale.trim();
    if (!normalized) return undefined;
    const [supportedLocale] = Intl.DateTimeFormat.supportedLocalesOf([normalized]);
    return supportedLocale;
  })();

  return new Intl.DateTimeFormat(formatterLocale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Unable to read the file"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
