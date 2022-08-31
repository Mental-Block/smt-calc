const confirmPassword = async (password: string, confirmPassword: string) => {
  if (password === confirmPassword) {
    return await Promise.resolve()
  }
  return await Promise.reject()
}

export default confirmPassword
