import { convertDate } from './date'
interface VolumeFetchRow {
  time: string
  PERPv1_vol: number
  PERPv2_vol: number
  atomic_volume: number
  total_volume: number
  '7_day_avg': number
  '30_day_avg': number
  '7_day_total': number
  '30_day_total': number
}

export interface DisplayRow {
  date: string
  PERP: number
  atomic_volume: number
  total_volume: number
}

export interface Result {
  dayData: DisplayRow[]
  weekData: DisplayRow[]
  monthData: DisplayRow[]
  dataAll: DisplayRow[]
}

export default function divideDuneVolumes(
  resultRows: VolumeFetchRow[]
): Result {
  const dayData: DisplayRow[] = []
  const weekData: DisplayRow[] = []
  const monthData: DisplayRow[] = []
  resultRows.forEach((row: VolumeFetchRow, idx: number) => {
    const { time, PERPv1_vol, PERPv2_vol, atomic_volume, total_volume } = row
    const displayRow: DisplayRow = {
      date: convertDate(time),
      PERP: PERPv1_vol + PERPv2_vol,
      atomic_volume,
      total_volume,
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
