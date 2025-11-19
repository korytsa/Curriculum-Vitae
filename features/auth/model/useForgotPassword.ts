import { useMutation } from '@apollo/client/react'
import { FORGOT_PASSWORD_MUTATION } from './graphql'

interface ForgotPasswordVariables {
  auth: {
    email: string
  }
}

interface ForgotPasswordResponse {
  forgotPassword: null
}

export function useForgotPassword() {
  const [forgotPasswordMutation, { loading, error }] = useMutation<
    ForgotPasswordResponse,
    ForgotPasswordVariables
  >(FORGOT_PASSWORD_MUTATION)

  const handleForgotPassword = async (email: string) => {
    return forgotPasswordMutation({
      variables: {
        auth: {
          email,
        },
      },
    })
  }

  return {
    forgotPassword: handleForgotPassword,
    loading,
    error,
  }
}


