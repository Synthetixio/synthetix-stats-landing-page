export const convertDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  })
