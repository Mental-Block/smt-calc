const addReactKey = (array: Record<string, unknown>[]) => {
  array.some((value) => {
    if (typeof value != 'object') throw 'Needs to be only an array of object'
  })

  return array.map((props, key) => ({ key, ...props }))
}

export default addReactKey
