import { gql } from "@apollo/client";

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
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
