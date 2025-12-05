"use client";

import type { RemoveCvProjectInput, RemoveCvProjectMutation, RemoveCvProjectMutationVariables, CvQueryVariables } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { REMOVE_CV_PROJECT_MUTATION, CV_QUERY } from "./graphql";

type RemoveCvProjectPayload = Omit<RemoveCvProjectInput, "cvId">;

export function useRemoveCvProject(cvId?: string) {
  const { mutate, loading, error } = useSafeMutation<
    RemoveCvProjectMutation,
    RemoveCvProjectMutationVariables
  >(REMOVE_CV_PROJECT_MUTATION, {
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

  const removeCvProject = async (payload: RemoveCvProjectPayload) => {
    if (!cvId) {
      throw new Error("CV id is required to remove a project");
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
    removeCvProject,
    loading,
    error,
  };
}

