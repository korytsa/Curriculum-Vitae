"use client";

import { useState } from "react";
import type { CvProject } from "@/shared/graphql/generated";
import type { SearchInputProps } from "@/shared/ui";
import type { ProjectsActiveField, ProjectsDirection, ProjectSearchState } from "./types";
import { PROJECTS_SEARCH_FIELDS, PROJECTS_ROOT_PATH_REGEX } from "./constants";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/shared/lib";

export const useProjectSearchState = (projects: CvProject[], placeholder: string): ProjectSearchState => {
  const [searchResults, setSearchResults] = useState<CvProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const filteredProjects = hasSearchQuery ? searchResults : projects;

  const handleResetSearch = () => {
    setSearchResetKey((prev) => prev + 1);
    setSearchResults([]);
    setSearchQuery("");
  };

  const searchInputProps: SearchInputProps<CvProject> = {
    data: projects,
    fields: [...PROJECTS_SEARCH_FIELDS],
    onResults: setSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: hasSearchQuery && filteredProjects.length === 0,
    placeholder,
  };

  return {
    searchInputProps,
    filteredProjects,
    hasSearchQuery,
    handleResetSearch,
  };
};

const parseDateToTimestamp = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getComparableValue = (project: CvProject, field: ProjectsActiveField): string | number | null => {
  switch (field) {
    case "name":
      return (project.name ?? project.project?.name ?? "").toLowerCase();
    case "domain":
      return (project.domain ?? "").toLowerCase();
    case "start_date":
      return parseDateToTimestamp(project.start_date);
    case "end_date":
      return parseDateToTimestamp(project.end_date);
    default:
      return null;
  }
};

export const sortProjects = (projects: CvProject[], field: ProjectsActiveField | null, direction: ProjectsDirection): CvProject[] => {
  if (!field) {
    return projects;
  }

  const multiplier = direction === "asc" ? 1 : -1;

  return [...projects].sort((projectA, projectB) => {
    const valueA = getComparableValue(projectA, field);
    const valueB = getComparableValue(projectB, field);
    let comparison = 0;

    if (valueA == null && valueB == null) {
      comparison = 0;
    } else if (valueA == null) {
      comparison = 1;
    } else if (valueB == null) {
      comparison = -1;
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      comparison = valueA === valueB ? 0 : valueA > valueB ? 1 : -1;
    } else {
      comparison = String(valueA).localeCompare(String(valueB));
    }

    return comparison * multiplier;
  });
};

export const formatDate = (value: string | null | undefined, locale?: string, presentLabel?: string): string => {
  if (!value) {
    return presentLabel ?? "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const useProjectsPermissions = () => {
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const isRootProjectsPage = !!pathname && PROJECTS_ROOT_PATH_REGEX.test(pathname);
  const canManageProjects = isAdmin || !isRootProjectsPage;

  return { isAdmin, isRootProjectsPage, canManageProjects };
};
