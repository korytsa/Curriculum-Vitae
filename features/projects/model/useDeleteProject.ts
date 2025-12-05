"use client";

import { gql } from "@apollo/client";
import type { DeleteProjectInput } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { PROJECTS_QUERY } from "./graphql";

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`;

type DeleteProjectPayload = DeleteProjectInput;

type DeleteProjectMutation = { __typename: "Mutation"; deleteProject: { __typename: "DeleteResult"; affected: number } };
type DeleteProjectMutationVariables = { project: DeleteProjectInput };

export function useDeleteProject() {
  const { mutate, loading, error } = useSafeMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY }],
  });

  const deleteProject = async (payload: DeleteProjectPayload) => {
    return mutate({
      variables: {
        project: payload,
      },
    });
  };

  return {
    deleteProject,
    loading,
    error,
  };
}
