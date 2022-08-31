import React from 'react'

import { API } from '@const'

import { AuthProps } from '@interfaces/auth'
import getToken from './getToken'

import { LoginProps } from '@interfaces/user'
import AuthContext from '@context/AuthContext'

const useAuth = () => {
  const { setAuth } = React.useContext(AuthContext)

  const login = async (values: LoginProps) => {
    const res = await fetch(`${API.USER}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      setAuth({ ok: false })
      return false
    }

    const data: AuthProps = await res.json()

    const token = getToken(data.accessToken)
    setAuth({ ...data, role: token?.role })

    return true
  }

  const logout = async () => {
    try {
      const res = await fetch(`${API.USER}/logout`, {
        credentials: 'include',
      })

      if (res.ok) {
        const data: AuthProps = await res.json()

        setAuth(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    logout,
    login,
  }
}

export default useAuth
