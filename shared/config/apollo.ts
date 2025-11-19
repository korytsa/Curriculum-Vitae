import { makeVar } from '@apollo/client'

export const accessTokenVar = makeVar<string | null>(
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
)

export const setAccessToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
  }
  accessTokenVar(token)
}

