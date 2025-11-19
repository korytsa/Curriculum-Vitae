import { useMutation } from '@apollo/client/react'
import { RESET_PASSWORD_MUTATION } from './graphql'

interface ResetPasswordVariables {
  auth: {
    newPassword: string
  }
}

interface ResetPasswordResponse {
  resetPassword: null
}

export function useResetPassword() {
  const [resetPasswordMutation, { loading, error }] = useMutation<
    ResetPasswordResponse,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  const handleResetPassword = (token: string, password: string) => {
    return resetPasswordMutation({
      variables: {
        auth: {
          newPassword: password,
        },
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    })
  }

  return {
    resetPassword: handleResetPassword,
    loading,
    error,
  }
}


