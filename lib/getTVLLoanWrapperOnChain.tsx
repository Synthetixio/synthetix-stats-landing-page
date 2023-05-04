import { getOVMBlock, getMainnetBlock } from './getBlock'
import { getTimeBlockRange } from './getTime'
import {
  fetchOVMLoans,
  fetchMainnetLoans,
  fetchMainnetWrapper,
  fetchOVMWrapper,
} from './getTVL'

const getData = async (
  blockList: number[],
  getBlock: (ts: number) => Promise<number>,
  getData: (block: number) => Promise<number>
) => {
  const blocks = await Promise.all(blockList.map(getBlock))
  const data = await Promise.all(blocks.map(getData))

  return data
}

export const getTVLLoan = async () => {
  const timeRange = getTimeBlockRange()
  // get loan and wrapper data for daily with ovm and mainnet
  const mainDailyWrapper = await getData(
    timeRange.dailyTs,
    getMainnetBlock,
    fetchMainnetWrapper
  )
  
  const mainDailyLoans = await getData(
    timeRange.dailyTs,
    getMainnetBlock,
    fetchMainnetLoans
  )

  const ovmDailyWrapper = await getData(
    timeRange.dailyTs,
    getOVMBlock,
    fetchOVMWrapper
  )
  const ovmDailyLoans = await getData(timeRange.dailyTs, getOVMBlock, fetchOVMLoans)

  // get loan and wrapper data for weekly
  const mainnetWeeklyWrapper = await getData(
    timeRange.weeklyTs,
    getMainnetBlock,
    fetchMainnetWrapper
  )
  const ovmWeeklyWrapper = await getData(
    timeRange.weeklyTs,
    getOVMBlock,
    fetchOVMWrapper
  )

  const mainnetWeeklyLoans = await getData(
    timeRange.weeklyTs,
    getMainnetBlock,
    fetchMainnetLoans
  )
  const ovmWeeklyLoans = await getData(timeRange.weeklyTs, getOVMBlock, fetchOVMLoans)

  // get loan and wrapper data for monthly
  const mainnetMonthlyWrapper = await getData(
    timeRange.monthlyTs,
    getMainnetBlock,
    fetchMainnetWrapper
  )
  const ovmMonthlyWrapper = await getData(
    timeRange.monthlyTs,
    getOVMBlock,
    fetchOVMWrapper
  )

  const mainnetMonthlyLoans = await getData(
    timeRange.monthlyTs,
    getMainnetBlock,
    fetchMainnetLoans
  )
  const ovmMonthlyLoans = await getData(
    timeRange.monthlyTs,
    getOVMBlock,
    fetchOVMLoans
  )

  return {
    mainnetWeeklyLoans,
    ovmWeeklyLoans,
    mainnetMonthlyLoans,
    ovmMonthlyLoans,
    mainnetWeeklyWrapper,
    ovmWeeklyWrapper,
    mainnetMonthlyWrapper,
    ovmMonthlyWrapper,
    mainDailyWrapper,
    ovmDailyWrapper,
    mainDailyLoans,
    ovmDailyLoans,
  }
}
