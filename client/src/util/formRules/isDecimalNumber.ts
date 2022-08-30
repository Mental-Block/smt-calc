const isDecimalNumber = (_: any, number: number): boolean => {
  if (number % 1 != 0) {
    return true
  }
  return false
}

export default isDecimalNumber
