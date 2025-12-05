"use client";

import { useQuery } from "@apollo/client/react";

import type { Project } from "@/shared/graphql/generated";
import { PROJECTS_QUERY } from "./graphql";

type ProjectsQueryResult = {
  projects: Project[];
};

export type UseProjectsResult = {
  projects: Project[];
  loading: boolean;
  error?: Error;
};

export function useProjects(): UseProjectsResult {
  const { data, loading, error } = useQuery<ProjectsQueryResult>(PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return {
    projects: data?.projects ?? [],
    loading,
    error: error ?? undefined,
  };
}
