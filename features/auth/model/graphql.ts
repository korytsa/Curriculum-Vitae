import { gql } from '@apollo/client'

export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
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

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      role
    }
  }
`

