export const safeSort = (a: object, b: object, key: string) => {
  // @ts-ignore
  const aDate = new Date(a[key])
  // @ts-ignore
  const bDate = new Date(b[key])

  if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
    throw new Error(`Invalid date format ${a} ${b}`)
  }

  return bDate.getTime() - aDate.getTime()
}
