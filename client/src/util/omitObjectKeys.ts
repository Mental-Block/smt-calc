function omitObjectKeys<T extends object = {}>(
  keys: string[],
  obj: T
): Partial<T> {
  return (keys as any).reduce((a: Partial<T>, e: keyof T) => {
    const { [e]: omitted, ...rest } = a
    return rest
  }, obj)
}

export default omitObjectKeys
