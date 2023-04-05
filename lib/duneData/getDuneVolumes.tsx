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

export default function getDuneVolumes(resultRows: VolumeFetchRow[]) {
}