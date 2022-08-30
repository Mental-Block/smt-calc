import { API } from '@const'

const isExistingUser = async (username: string): Promise<void> => {
  const res = await fetch(`${API.USER}/${username}`, {
    credentials: 'include',
    method: 'POST',
  })

  const isUser: boolean = await res.json()

  if (isUser) {
    return await Promise.reject()
  }
  return await Promise.resolve()
}

export default isExistingUser
