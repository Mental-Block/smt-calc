import React from 'react'

let counter = 0

const useGenerateId = () => {
  const id = React.useMemo(() => ++counter, [])

  return (suffix: string) => `id${id}_${suffix}`
}

export default useGenerateId
