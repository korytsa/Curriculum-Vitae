import { gql } from "@apollo/client";

const CV_PROJECT_FIELDS = gql`
  fragment CvProjectFields on CvProject {
    id
    name
    internal_name
    domain
    start_date
    end_date
    description
    environment
    responsibilities
    roles
    project {
      id
      name
      internal_name
    }
  }
`;

export const CVS_QUERY = gql`
  query Cvs {
    cvs {
      id
      name
      education
      description
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_CV_MUTATION = gql`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;

export const CV_QUERY = gql`
  query Cv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      education
      description
      languages {
        name
        proficiency
      }
      skills {
        name
        mastery
        categoryId
      }
      projects {
        ...CvProjectFields
      }
      user {
        id
        email
        position_name
        department_name
        profile {
          full_name
          first_name
          last_name
          avatar
        }
      }
    }
    skillCategories {
      id
      name
      order
      parent {
        id
        name
      }
    }
  }
  ${CV_PROJECT_FIELDS}
`;

export const ADD_CV_PROJECT_MUTATION = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
      projects {
        ...CvProjectFields
      }
    }
  }
  ${CV_PROJECT_FIELDS}
`;

export const UPDATE_CV_MUTATION = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;

export const DELETE_CV_MUTATION = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;

export const UPDATE_CV_PROJECT_MUTATION = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      projects {
        ...CvProjectFields
      }
    }
  }
  ${CV_PROJECT_FIELDS}
`;

export const REMOVE_CV_PROJECT_MUTATION = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
      projects {
        ...CvProjectFields
      }
    }
  }
  ${CV_PROJECT_FIELDS}
`;
