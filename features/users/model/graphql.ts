import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
      created_at
      department_name
      position_name
      profile {
        id
        first_name
        last_name
        avatar
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`;

export const USER_QUERY = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      id
      email
      created_at
      department_name
      position_name
      profile {
        id
        first_name
        last_name
        avatar
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`;

export const USER_DIRECTORIES_QUERY = gql`
  query UserDirectories {
    departments {
      id
      name
    }
    positions {
      id
      name
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
      avatar
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      department_name
      position_name
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`;
