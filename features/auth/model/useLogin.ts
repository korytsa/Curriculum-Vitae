import { useMutation } from '@apollo/client/react'
import { LOGIN_MUTATION } from './graphql'
import { setAccessToken } from '@/shared/config/apollo'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface LoginVariables {
  auth: {
    email: string
    password: string
  }
}

interface LoginResponse {
  login: {
    access_token: string
  }
}

export function useLogin() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  const [login, { loading, error }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const token = data.login.access_token
      setAccessToken(token)
      router.push(`/${locale}/cvs`)
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  const handleLogin = (email: string, password: string) => {
    return login({
      variables: {
        auth: {
          email,
          password,
        },
      },
    })
  }

  return {
    login: handleLogin,
    loading,
    error,
  }
}

