import { convertDate } from './date'

interface FetchRow {
  '7_day_L1': number
  '7_day_L2': number
  '7_day_combined': number
  '7_day_cumulative': number
  '30_day_L1': number
  '30_day_L2': number
  '30_day_combined': number
  '30_day_cumulative': number
  combined: number
  day: string
  l1fee: number
  l2fee: number
}

export interface DisplayRow {
  date: string
  l1fee: number
  l2fee: number
  combined: number
}

export interface Result {
  dayData: DisplayRow[]
  weekData: DisplayRow[]
  monthData: DisplayRow[]
  dataAll: DisplayRow[]
}

export default function divideDuneFees(resultRows: FetchRow[]): Result {
  const dayData: DisplayRow[] = []
  const weekData: DisplayRow[] = []
  const monthData: DisplayRow[] = []
  resultRows.forEach((row: FetchRow, idx: number) => {
    const { day, l1fee, l2fee, combined } = row
    const displayRow: DisplayRow = {
      date: convertDate(day),
      l1fee,
      l2fee,
      combined,
    }
    if (idx < 7 * 7) {
      weekData.push(displayRow)
    }
    if (idx < 7 * 30) {
      monthData.push(displayRow)
    }
    dayData.push(displayRow)
  })

  return {
    dayData: dayData.slice(0, 7).reverse(),
    weekData: weekData.reverse(),
    monthData: monthData.reverse(),
    dataAll: dayData.reverse(),
  }
}
