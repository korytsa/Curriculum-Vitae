import { gql } from "@apollo/client";

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
        profile {
          full_name
        }
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
      user {
        id
        email
        profile {
          full_name
        }
      }
    }
  }
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
