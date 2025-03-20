export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.reduce<T[][]>((chunks, _, i) => {
    if (i % size === 0) chunks.push(arr.slice(i, i + size))
    return chunks
  }, [])
