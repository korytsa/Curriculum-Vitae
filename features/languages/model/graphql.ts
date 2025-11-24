import { gql } from "@apollo/client";

export const LANGUAGES_WITH_PROFILE_QUERY = gql`
  query LanguagesWithProfile($userId: ID!) {
    languages {
      id
      name
    }
    profile(userId: $userId) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const ADD_PROFILE_LANGUAGE_MUTATION = gql`
  mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const DELETE_PROFILE_LANGUAGE_MUTATION = gql`
  mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;
