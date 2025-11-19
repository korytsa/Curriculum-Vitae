import { useLazyQuery } from '@apollo/client/react'
import { LOGIN_QUERY } from './graphql'
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

  const [loginQuery, { loading, error }] = useLazyQuery<LoginResponse, LoginVariables>(LOGIN_QUERY, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  const handleLogin = async (email: string, password: string) => {
    const result = await loginQuery({
      variables: {
        auth: {
          email,
          password,
        },
      },
    })

    const token = result.data?.login.access_token
    if (token) {
      setAccessToken(token)
      router.push(`/${locale}/cvs`)
    }
  }

  return {
    login: handleLogin,
    loading,
    error,
  }
}

