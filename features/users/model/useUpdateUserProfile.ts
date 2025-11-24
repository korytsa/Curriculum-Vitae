import { useSafeMutation } from "@/shared/lib";
import {
  UPDATE_PROFILE_MUTATION,
  UPDATE_USER_MUTATION,
  UPLOAD_AVATAR_MUTATION,
} from "./graphql";
import type {
  Profile,
  UpdateProfileInput,
  UpdateUserInput,
  UploadAvatarInput,
} from "@/shared/graphql/generated";

type UpdateProfileMutation = {
  updateProfile: Profile;
};

type UpdateProfileMutationVariables = {
  profile: UpdateProfileInput;
};

type UpdateUserMutation = {
  updateUser: {
    id: string;
    department_name?: string | null;
    position_name?: string | null;
  };
};

type UpdateUserMutationVariables = {
  user: UpdateUserInput;
};

type UploadAvatarMutation = {
  uploadAvatar: string;
};

type UploadAvatarMutationVariables = {
  avatar: UploadAvatarInput;
};

export function useUpdateUserProfile(userId?: string) {
  const {
    mutate: runProfileMutation,
    loading: profileLoading,
    error: profileError,
  } = useSafeMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UPDATE_PROFILE_MUTATION
  );

  const {
    mutate: runUserMutation,
    loading: userLoading,
    error: userError,
  } = useSafeMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UPDATE_USER_MUTATION
  );

  const {
    mutate: runAvatarMutation,
    loading: avatarLoading,
    error: avatarError,
  } = useSafeMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(
    UPLOAD_AVATAR_MUTATION
  );

  const updateProfile = async (profile: Omit<UpdateProfileInput, "userId">) => {
    if (!userId) {
      throw new Error("User ID is required to update profile");
    }
    return runProfileMutation({
      variables: {
        profile: {
          userId,
          ...profile,
        },
      },
    });
  };

  const updateUser = async (user: Omit<UpdateUserInput, "userId">) => {
    if (!userId) {
      throw new Error("User ID is required to update user metadata");
    }
    return runUserMutation({
      variables: {
        user: {
          userId,
          ...user,
        },
      },
    });
  };

  const uploadAvatar = async (avatar: Omit<UploadAvatarInput, "userId">) => {
    if (!userId) {
      throw new Error("User ID is required to upload avatar");
    }
    return runAvatarMutation({
      variables: {
        avatar: {
          userId,
          ...avatar,
        },
      },
    });
  };

  return {
    updateProfile,
    updateUser,
    uploadAvatar,
    loading: profileLoading || userLoading || avatarLoading,
    errors: {
      profile: profileError,
      user: userError,
      avatar: avatarError,
    },
  };
}
