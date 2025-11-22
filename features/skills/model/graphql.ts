import { gql } from "@apollo/client";

export const SKILL_CATEGORIES_QUERY = gql`
  query SkillCategoriesForForm {
    skillCategories {
      id
      name
    }
  }
`;

export const SKILLS_WITH_CATEGORIES_QUERY = gql`
  query SkillsWithCategories {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
      }
    }
    skills {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

export const CREATE_SKILL_MUTATION = gql`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      __typename
    }
  }
`;

export const UPDATE_SKILL_MUTATION = gql`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      name
      category {
        id
        name
      }
    }
  }
`;
