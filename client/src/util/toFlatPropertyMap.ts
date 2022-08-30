function isValidDate(value: any) {
  const dateWrapper = new Date(value)
  return !isNaN(dateWrapper.getDate())
}

export function toFlatPropertyMap<O extends object>(obj: O, keySeparator = '.') {
  const flattenRecursive = (
    obj: O,
    parentProperty?: string,
    propertyMap: Partial<O> = {}
  ) => {
    for (const [key, value] of Object.entries(obj)) {
      const property = parentProperty
        ? `${parentProperty}${keySeparator}${key}`
        : key

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !isValidDate(value)
      ) {
        flattenRecursive(value, property, propertyMap)
      } else {
        propertyMap[property as keyof O] = value
      }
    }
    return propertyMap
  }
  return flattenRecursive(obj)
}
