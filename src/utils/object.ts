export const convertArrayToObject = <
  T extends Record<string, any>,
  K extends keyof T
>(
  arr: T[],
  key: K
): Record<T[K], Omit<T, K>> =>
  arr.reduce((acc, obj) => {
    const { [key]: keyValue, ...rest } = obj
    acc[keyValue] = rest
    return acc
  }, {} as Record<T[K], Omit<T, K>>)
