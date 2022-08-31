const mergeArrayObjects = (
  array: Record<string, any>[], // WARNING KEY VALUES WILL BE OVERWRITTEN
  array2: Record<string, any>[], // WARNING KEY VALUES WILL BE OVERWRITTEN
  lookUpKey = 'id' // LOOK UP KEY
): any[] => {
  return array.map((item: any, i: number) => {
    return item.children
      ? {
          ...item,
          ...array2[i],
          children: mergeArrayObjects(item.children, array2[i].children),
        }
      : item[lookUpKey] === array2[i][lookUpKey] &&
          Object.assign({}, item, array2[i])
  })
}

export default mergeArrayObjects
