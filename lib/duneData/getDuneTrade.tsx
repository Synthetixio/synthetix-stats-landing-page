import { formatPercentDec } from '../../constants/format'
interface TradeFetchRow {
  total: number
  time: string
  trackingCode: string
}

interface accResult {
    [key: string]: TradeFetchRow[]
}

export default function getDuneTrade(resultRows) {
  const acc: accResult = {}

  resultRows.forEach((row: TradeFetchRow) => {
    const { trackingCode } = row
    if (acc[trackingCode]) {
      acc[trackingCode].push(row)
    } else {
      acc[trackingCode] = [row]
    }
  })

  Object.keys(acc).forEach((key) => {
    const res = acc[key].sort((a, b) => {
      return new Date(b.time) - new Date(a.time)
    })
    acc[key] = res
  })

  function calcWithDateRange(data: TradeFetchRow[], timeSection?: number) {
    if (!timeSection) {
      return data
    }
    const now = new Date()
    const time = now.getTime()
    const timeRange = time - timeSection * 24 * 60 * 60 * 1000
    const res = data.filter((item) => {
      return new Date(item.time).getTime() > timeRange
    })
    return res
  }

  function sumUp(items: TradeFetchRow[]) {
    return items.reduce((acc, item) => {
      return acc + item.total
    }, 0)
  }

  function calcTimeRangePieData(data: accResult, timeRange: number) {
    const totalProjectRows = Object.keys(data)
      .reduce((result, key) => {
        const rows = data[key]
        const project = {
          name: key,
          value: sumUp(calcWithDateRange(rows, timeRange)),
        }

        result.push(project)
        return result
      }, [])
      .filter((item) => item.value > 0)

    const timeRangeTotalFee = totalProjectRows.reduce(
      (acc, item) => (acc += item.value),
      0
    )
    Object.keys(totalProjectRows).forEach((key) => {
      const item = totalProjectRows[key]
      const percent = item.value / timeRangeTotalFee
      item.percent = formatPercentDec.format(percent)
    })

    return {
      totalFee: timeRangeTotalFee,
      projects: totalProjectRows,
    }
  }

  const dayFees = calcTimeRangePieData(acc, 1)
  const weekFees = calcTimeRangePieData(acc, 7)
  const monthFees = calcTimeRangePieData(acc, 30)
  const threeMonthesFees = calcTimeRangePieData(acc, 90)
  const wholeTimeFees = calcTimeRangePieData(acc, 0)
  return { dayFees, weekFees, monthFees, threeMonthesFees, wholeTimeFees }
}
