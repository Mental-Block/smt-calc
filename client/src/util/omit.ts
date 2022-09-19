export default function omit<T>(keys: Array<keyof T>, obj: T) {
  const newObject = Object.assign({}, obj)

  for (let index = 0; index < keys.length; index++) {
    delete newObject[keys[index]]
    index++
  }

  return newObject
}
