const mergeArrayObjects = (
  array: Record<string, any>[], // WARNING VALUES WILL BE OVERWRITTEN
  array2: Record<string, any>[], // WARNING VALUES WILL BE OVERWRITTEN
  lookUpKey = 'id',
  recursiveKey = 'children'
): any[] => {
  return array.map((item: any, i: number) => {
    return item[recursiveKey]
      ? {
          ...item,
          ...array2[i],
          [recursiveKey]: mergeArrayObjects(
            item[recursiveKey],
            array2[i][recursiveKey]
          ),
        }
      : item[lookUpKey] === array2[i][lookUpKey] &&
          Object.assign({}, item, array2[i])
  })
}

export default mergeArrayObjects
