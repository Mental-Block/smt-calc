const isWholeNumber = (_: any, number: number): Promise<void> => {
  if (number % 1 === 0) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}

export default isWholeNumber
