"use client";

import { gql } from "@apollo/client";
import type { CreateProjectInput, Mutation } from "@/shared/graphql/generated";
import { useSafeMutation } from "@/shared/lib";
import { PROJECTS_QUERY } from "./graphql";

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      name
      internal_name
      domain
      description
      environment
      start_date
      end_date
    }
  }
`;

type CreateProjectPayload = CreateProjectInput;

type CreateProjectMutation = {
  __typename: "Mutation";
  createProject: {
    __typename: "Project";
    id: string;
    name: string;
    internal_name: string;
    domain: string;
    description: string;
    environment: string[];
    start_date: string;
    end_date?: string | null;
  };
};
type CreateProjectMutationVariables = { project: CreateProjectInput };

export function useCreateProject() {
  const { mutate, loading, error } = useSafeMutation<CreateProjectMutation, CreateProjectMutationVariables>(CREATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY }],
  });

  const createProject = async (payload: CreateProjectPayload) => {
    return mutate({
      variables: {
        project: payload,
      },
    });
  };

  return {
    createProject,
    loading,
    error,
  };
}
