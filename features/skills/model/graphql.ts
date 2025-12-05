import { gql } from "@apollo/client";

export const SKILL_CATEGORIES_QUERY = gql`
  query SkillCategoriesForForm {
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
`;

export const SKILLS_WITH_CATEGORIES_QUERY = gql`
  query SkillsWithCategories($userId: ID!) {
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
    profile(userId: $userId) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const ADD_PROFILE_SKILL_MUTATION = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_PROFILE_SKILL_MUTATION = gql`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
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

export const ADMIN_SKILLS_QUERY = gql`
  query AdminSkills {
    skills {
      id
      name
      category {
        id
        name
      }
      category_name
      category_parent_name
      created_at
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
      category_name
      category_parent_name
      created_at
    }
  }
`;

export const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`;

export const ADMIN_UPDATE_SKILL_MUTATION = gql`
  mutation AdminUpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      name
      category {
        id
        name
      }
      category_name
      category_parent_name
      created_at
    }
  }
`;
