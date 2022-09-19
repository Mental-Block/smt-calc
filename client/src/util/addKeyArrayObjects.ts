const addKeyArrayObjects = (
  array: Record<string, any>[],
  key = 'id',
  recursiveKey = 'children'
): any[] => {
  return array.map((item: any, i: number) => {
    if (item[recursiveKey]) {
      return { ...item, [recursiveKey]: addKeyArrayObjects(item[recursiveKey]) }
    }

    return {
      [key]: i,
      ...item,
    }
  })
}

export default addKeyArrayObjects
