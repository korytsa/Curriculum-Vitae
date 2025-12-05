import { useSafeMutation } from "@/shared/lib";
import { getUserId } from "./utils";
import {
  CREATE_SKILL_MUTATION,
  ADMIN_UPDATE_SKILL_MUTATION,
  UPDATE_SKILL_MUTATION,
  DELETE_SKILL_MUTATION,
  DELETE_PROFILE_SKILL_MUTATION,
  ADD_PROFILE_SKILL_MUTATION,
  ADMIN_SKILLS_QUERY,
  SKILLS_WITH_CATEGORIES_QUERY,
} from "./graphql";
import type {
  AddProfileSkillMutation,
  AddProfileSkillMutationVariables,
  UpdateSkillMutation,
  UpdateSkillMutationVariables,
  DeleteProfileSkillMutation,
  DeleteProfileSkillMutationVariables,
  SkillsWithCategoriesQueryVariables,
} from "@/shared/graphql/generated";
import type {
  AdminCreateSkillPayload,
  AdminUpdateSkillPayload,
  AdminDeleteSkillPayload,
  CreateSkillPayload,
  UpdateSkillPayload,
  DeleteSkillPayload,
  AdminCreateSkillMutationData,
  AdminCreateSkillMutationVariables,
  AdminUpdateSkillMutationData,
  AdminUpdateSkillMutationVariables,
  AdminDeleteSkillMutationData,
  AdminDeleteSkillMutationVariables,
} from "../types";

export function useAdminCreateSkill() {
  const { mutate, loading, error } = useSafeMutation<AdminCreateSkillMutationData, AdminCreateSkillMutationVariables>(CREATE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const createSkill = async (payload: AdminCreateSkillPayload) =>
    mutate({
      variables: { skill: payload },
    });

  return { createSkill, loading, error };
}

export function useAdminUpdateSkill() {
  const { mutate, loading, error } = useSafeMutation<AdminUpdateSkillMutationData, AdminUpdateSkillMutationVariables>(ADMIN_UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const updateSkill = async (payload: AdminUpdateSkillPayload) =>
    mutate({
      variables: { skill: payload },
    });

  return { updateSkill, loading, error };
}

export function useAdminDeleteSkill() {
  const { mutate, loading, error } = useSafeMutation<AdminDeleteSkillMutationData, AdminDeleteSkillMutationVariables>(DELETE_SKILL_MUTATION, {
    refetchQueries: [{ query: ADMIN_SKILLS_QUERY }],
  });

  const deleteSkill = async (payload: AdminDeleteSkillPayload) =>
    mutate({
      variables: { skill: payload },
    });

  return { deleteSkill, loading, error };
}

export function useCreateSkill() {
  const userId = getUserId();

  const { mutate, loading, error } = useSafeMutation<AddProfileSkillMutation, AddProfileSkillMutationVariables>(ADD_PROFILE_SKILL_MUTATION, {
    refetchQueries: userId ? [{ query: SKILLS_WITH_CATEGORIES_QUERY, variables: { userId } }] : [],
  });

  const createSkill = async (payload: CreateSkillPayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        skill: {
          ...payload,
          userId,
        },
      },
    });
  };

  return { createSkill, loading, error };
}

export function useUpdateSkill() {
  const { mutate, loading, error } = useSafeMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(UPDATE_SKILL_MUTATION, {
    refetchQueries: [{ query: SKILLS_WITH_CATEGORIES_QUERY }],
  });

  const updateSkill = async (payload: UpdateSkillPayload) =>
    mutate({
      variables: { skill: payload },
    });

  return { updateSkill, loading, error };
}

export function useDeleteSkill() {
  const userId = getUserId();

  const { mutate, loading, error } = useSafeMutation<DeleteProfileSkillMutation, DeleteProfileSkillMutationVariables>(DELETE_PROFILE_SKILL_MUTATION, {
    refetchQueries: userId
      ? [
          {
            query: SKILLS_WITH_CATEGORIES_QUERY,
            variables: { userId } as SkillsWithCategoriesQueryVariables,
          },
        ]
      : [],
  });

  const deleteSkill = async (payload: DeleteSkillPayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        skill: {
          name: payload.name,
          userId,
        },
      },
    });
  };

  return { deleteSkill, loading, error };
}
