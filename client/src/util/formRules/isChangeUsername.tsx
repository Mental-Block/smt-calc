import { API } from '@const'
import { UserDataProps } from '@interfaces/user'

const isChangeUsername = async (
  idFeild: number,
  value: Pick<UserDataProps, 'username'>
) => {
  const res = await fetch(`${API.USER}/isuser`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({ username: value }),
  })

  const { id }: Omit<UserDataProps, 'username' | 'role'> = await res.json()

  if (id && idFeild !== id) {
    return Promise.reject()
  }

  return Promise.resolve()
}

export default isChangeUsername
