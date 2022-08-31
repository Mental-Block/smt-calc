import { API } from '@const'

const isPartNumber = async (_: any, part_number: string): Promise<boolean> => {
  const res = await fetch(`${API}/parts/ispartnumber`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({ part_number }),
  })

  if (res.ok) {
    return Promise.resolve()
  }
  return Promise.reject()
}

export default isPartNumber
