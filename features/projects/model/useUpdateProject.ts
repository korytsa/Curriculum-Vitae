"use client";

import { gql } from "@apollo/client";
import type { UpdateProjectInput } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { PROJECTS_QUERY } from "./graphql";

const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      name
      domain
      description
      environment
      start_date
      end_date
    }
  }
`;

type UpdateProjectPayload = UpdateProjectInput;

type UpdateProjectMutation = {
  __typename: "Mutation";
  updateProject: {
    __typename: "Project";
    id: string;
    name: string;
    domain: string;
    description: string;
    environment: string[];
    start_date: string;
    end_date?: string | null;
  };
};
type UpdateProjectMutationVariables = { project: UpdateProjectInput };

export function useUpdateProject() {
  const { mutate, loading, error } = useSafeMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY }],
  });

  const updateProject = async (payload: UpdateProjectPayload) => {
    return mutate({
      variables: {
        project: payload,
      },
    });
  };

  return {
    updateProject,
    loading,
    error,
  };
}
