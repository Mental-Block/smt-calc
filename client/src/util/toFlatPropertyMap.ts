function isValidDate(value: any) {
  var dateWrapper = new Date(value)
  return !isNaN(dateWrapper.getDate())
}

export function toFlatPropertyMap<O, N>(obj: O, keySeparator = '.') {
  const flattenRecursive = (
    obj: O,
    parentProperty?: string,
    propertyMap: Partial<N> = {}
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
        propertyMap[property as keyof N] = value
      }
    }
    return propertyMap
  }
  return flattenRecursive(obj)
}
