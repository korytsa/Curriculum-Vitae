import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
  mutation Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
    }
  }
`

