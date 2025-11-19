import { useMutation } from '@apollo/client/react'
import { CREATE_USER_MUTATION } from './graphql'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface CreateUserVariables {
  user: {
    auth: {
      email: string
      password: string
    }
    profile: {
      first_name: string
      last_name: string
    }
    departmentId?: string
    positionId?: string
    cvsIds: string[]
    role: 'Admin' | 'Employee'
  }
}

interface CreateUserResponse {
  createUser: {
    id: string
    email: string
    role: 'Admin' | 'Employee'
  }
}

export function useCreateUser() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  const [createUserMutation, { loading, error }] = useMutation<CreateUserResponse, CreateUserVariables>(
    CREATE_USER_MUTATION,
    {
      onCompleted: (data) => {
        console.log('User created:', data.createUser)
        router.push(`/${locale}/users`)
      },
      onError: (error) => {
        console.error('Create user error:', error)
      },
    }
  )

  const handleCreateUser = (
    email: string,
    password: string,
    profile: { first_name?: string; last_name?: string } = {},
    role: 'Admin' | 'Employee' = 'Employee',
    options?: { departmentId?: string; positionId?: string }
  ) => {
    const profilePayload = {
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
    }

    return createUserMutation({
      variables: {
        user: {
          auth: {
            email,
            password,
          },
          profile: profilePayload,
          cvsIds: [],
          departmentId: options?.departmentId,
          positionId: options?.positionId,
          role,
        },
      },
    })
  }

  return {
    createUser: handleCreateUser,
    loading,
    error,
  }
}

