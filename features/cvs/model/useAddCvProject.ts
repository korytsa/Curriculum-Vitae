"use client";

import type { AddCvProjectInput, AddCvProjectMutation, AddCvProjectMutationVariables, CvQueryVariables } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { ADD_CV_PROJECT_MUTATION, CV_QUERY } from "./graphql";

type AddCvProjectPayload = Omit<AddCvProjectInput, "cvId">;

export function useAddCvProject(cvId?: string) {
  const { mutate, loading, error } = useSafeMutation<AddCvProjectMutation, AddCvProjectMutationVariables>(ADD_CV_PROJECT_MUTATION, {
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

  const addCvProject = async (payload: AddCvProjectPayload) => {
    if (!cvId) {
      throw new Error("CV id is required to add a project");
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
    addCvProject,
    loading,
    error,
  };
}
