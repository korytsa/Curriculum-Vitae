import { useMutation } from '@apollo/client/react'
import { SIGNUP_MUTATION } from './graphql'
import { setAccessToken } from '@/shared/config/apollo'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface SignupVariables {
  auth: {
    email: string
    password: string
  }
}

interface SignupResponse {
  signup: {
    access_token: string
  }
}

export function useSignup() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  const [signupMutation, { loading, error }] = useMutation<SignupResponse, SignupVariables>(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const token = data.signup.access_token
      setAccessToken(token)
      router.push(`/${locale}/cvs`)
    },
    onError: (error) => {
      console.error('Signup error:', error)
    },
  })

  const handleSignup = (email: string, password: string) => {
    return signupMutation({
      variables: {
        auth: {
          email,
          password,
        },
      },
    })
  }

  return {
    signup: handleSignup,
    loading,
    error,
  }
}

