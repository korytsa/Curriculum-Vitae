"use client";

import type { UpdateCvProjectInput, UpdateCvProjectMutation, UpdateCvProjectMutationVariables, CvQueryVariables } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { UPDATE_CV_PROJECT_MUTATION, CV_QUERY } from "./graphql";

type UpdateCvProjectPayload = Omit<UpdateCvProjectInput, "cvId">;

export function useUpdateCvProject(cvId?: string) {
  const { mutate, loading, error } = useSafeMutation<
    UpdateCvProjectMutation,
    UpdateCvProjectMutationVariables
  >(UPDATE_CV_PROJECT_MUTATION, {
    refetchQueries:
      cvId != null
        ? [
            {
              query: CV_QUERY,
              variables: { cvId } as CvQueryVariables,
            },
          ]
        : [],
  });

  const updateCvProject = async (payload: UpdateCvProjectPayload) => {
    if (!cvId) {
      throw new Error("CV id is required to update a project");
    }

    return mutate({
      variables: {
        project: {
          ...payload,
          cvId,
        },
      },
    });
  };

  return {
    updateCvProject,
    loading,
    error,
  };
}

