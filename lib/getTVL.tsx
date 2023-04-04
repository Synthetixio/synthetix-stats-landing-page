import getTime from './getTime'
import {
  getDebtStates,
  getLatestRateById,
  getLoans,
  getWrappers,
} from '../subgraphs/subgraph-ovm'
import { block } from './getBlock'

// start data collection at 5 minutes ago to allow data sync

const { timeStamp } = getTime()

const mainnet_url =
  'https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main'
const optimism_url =
  'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main'

const fetchTVL = async (block: number, network: string) => {
  const tvlCall = await getDebtStates(
    network,
    {
      orderBy: 'timestamp',
      orderDirection: 'desc',
      first: 1,
      block: { number: block },
    },
    { debtEntry: true }
  )

  const activeDebt = tvlCall[0].debtEntry.toNumber()
  return activeDebt
}

const fetchWrapper = async (block: number, network: string) => {
  const wrapperCall = await getWrappers(
    network,
    { block: { number: block } },
    { amountInUSD: true }
  )

  const activeWrapper = wrapperCall.reduce((sum: number, cur) => {
    return sum + cur.amountInUSD.toNumber()
  }, 0)

  return activeWrapper
}

const fetchLoans = async (block: number, network: string) => {
  const loanCall = await getLoans(
    network,
    {
      block: { number: block },
      where: { isOpen: true },
      orderBy: 'collateralAmount',
      orderDirection: 'desc',
    },
    { collateralAmount: true }
  )

  const rateCall = await getLatestRateById(
    network,
    { id: 'sETH' },
    { rate: true }
  )

  const sEthRate = rateCall.rate.toNumber()

  const activeLoans = loanCall.reduce((sum: number, cur) => {
    return sum + cur.collateralAmount.toNumber() * sEthRate
  }, 0)

  return activeLoans
}


export const getTVL = async () => {
  const blocks = await block()

  const ovmCurrentDebt = await fetchTVL(
    blocks.ovm.ovmCurrentBlock,
    optimism_url
  )
  const mainCurrentDebt = await fetchTVL(
    blocks.main.mainCurrentBlock,
    mainnet_url
  )
  const allCurrentDebt = ovmCurrentDebt + mainCurrentDebt

  const ovmCurrentWrapper = await fetchWrapper(
    blocks.ovm.ovmCurrentBlock,
    optimism_url
  )
  const mainCurrentWrapper = await fetchWrapper(
    blocks.main.mainCurrentBlock,
    mainnet_url
  )
  const allCurrentWrapper = ovmCurrentWrapper + mainCurrentWrapper

  const ovmCurrentLoan = await fetchLoans(
    blocks.ovm.ovmCurrentBlock,
    optimism_url
  )
  const mainCurrentLoan = await fetchLoans(
    blocks.main.mainCurrentBlock,
    mainnet_url
  )
  const allCurrentLoan = ovmCurrentLoan + mainCurrentLoan

  const ovmFourHourDebt = await fetchTVL(
    blocks.ovm.ovmFourHourBlock,
    optimism_url
  )
  const mainFourHourDebt = await fetchTVL(
    blocks.main.mainFourHourBlock,
    mainnet_url
  )
  const allFourHourDebt = ovmFourHourDebt + mainFourHourDebt

  const ovmFourHourWrapper = await fetchWrapper(
    blocks.ovm.ovmFourHourBlock,
    optimism_url
  )
  const mainFourHourWrapper = await fetchWrapper(
    blocks.main.mainFourHourBlock,
    mainnet_url
  )
  const allFourHourWrapper = ovmFourHourWrapper + mainFourHourWrapper

  const ovmFourHourLoan = await fetchLoans(
    blocks.ovm.ovmFourHourBlock,
    optimism_url
  )
  const mainFourHourLoan = await fetchLoans(
    blocks.main.mainFourHourBlock,
    mainnet_url
  )
  const allFourHourLoan = ovmFourHourLoan + mainFourHourLoan

  const ovmEightHourDebt = await fetchTVL(
    blocks.ovm.ovmEightHourBlock,
    optimism_url
  )
  const mainEightHourDebt = await fetchTVL(
    blocks.main.mainEightHourBlock,
    mainnet_url
  )
  const allEightHourDebt = ovmEightHourDebt + mainEightHourDebt

  const ovmEightHourWrapper = await fetchWrapper(
    blocks.ovm.ovmEightHourBlock,
    optimism_url
  )
  const mainEightHourWrapper = await fetchWrapper(
    blocks.main.mainEightHourBlock,
    mainnet_url
  )
  const allEightHourWrapper = mainEightHourWrapper + ovmEightHourWrapper

  const ovmEightHourLoan = await fetchLoans(
    blocks.ovm.ovmEightHourBlock,
    optimism_url
  )
  const mainEightHourLoan = await fetchLoans(
    blocks.main.mainEightHourBlock,
    mainnet_url
  )
  const allEightHourLoan = ovmEightHourLoan + mainEightHourLoan

  const ovmTwelveHourDebt = await fetchTVL(
    blocks.ovm.ovmTwelveHourBlock,
    optimism_url
  )
  const mainTwelveHourDebt = await fetchTVL(
    blocks.main.mainTwelveHourBlock,
    mainnet_url
  )
  const allTwelveHourDebt = ovmTwelveHourDebt + mainTwelveHourDebt

  const ovmTwelveHourWrapper = await fetchWrapper(
    blocks.ovm.ovmTwelveHourBlock,
    optimism_url
  )
  const mainTwelveHourWrapper = await fetchWrapper(
    blocks.main.mainTwelveHourBlock,
    mainnet_url
  )
  const allTwelveHourWrapper = ovmTwelveHourWrapper + mainTwelveHourWrapper

  const ovmTwelveHourLoan = await fetchLoans(
    blocks.ovm.ovmTwelveHourBlock,
    optimism_url
  )
  const mainTwelveHourLoan = await fetchLoans(
    blocks.main.mainTwelveHourBlock,
    mainnet_url
  )
  const allTwelveHourLoan = ovmTwelveHourLoan + mainTwelveHourLoan

  const ovmSixteenHourDebt = await fetchTVL(
    blocks.ovm.ovmSixteenHourBlock,
    optimism_url
  )
  const mainSixteenHourDebt = await fetchTVL(
    blocks.main.mainSixteenHourBlock,
    mainnet_url
  )
  const allSixteenHourDebt = ovmSixteenHourDebt + mainSixteenHourDebt

  const ovmSixteenHourWrapper = await fetchWrapper(
    blocks.ovm.ovmSixteenHourBlock,
    optimism_url
  )
  const mainSixteenHourWrapper = await fetchWrapper(
    blocks.main.mainSixteenHourBlock,
    mainnet_url
  )
  const allSixteenHourWrapper = ovmSixteenHourWrapper + mainSixteenHourWrapper

  const ovmSixteenHourLoan = await fetchLoans(
    blocks.ovm.ovmSixteenHourBlock,
    optimism_url
  )
  const mainSixteenHourLoan = await fetchLoans(
    blocks.main.mainSixteenHourBlock,
    mainnet_url
  )
  const allSixteenHourLoan = ovmSixteenHourLoan + mainSixteenHourLoan

  const ovmTwentyHourDebt = await fetchTVL(
    blocks.ovm.ovmTwentyHourBlock,
    optimism_url
  )
  const mainTwentyHourDebt = await fetchTVL(
    blocks.main.mainTwentyHourBlock,
    mainnet_url
  )
  const allTwentyHourDebt = ovmTwentyHourDebt + mainTwentyHourDebt

  const ovmTwentyHourWrapper = await fetchWrapper(
    blocks.ovm.ovmTwentyHourBlock,
    optimism_url
  )
  const mainTwentyHourWrapper = await fetchWrapper(
    blocks.main.mainTwentyHourBlock,
    mainnet_url
  )
  const allTWentyHourWrapper = ovmTwentyHourWrapper + mainTwentyHourWrapper

  const ovmTwentyHourLoan = await fetchLoans(
    blocks.ovm.ovmTwentyHourBlock,
    optimism_url
  )
  const mainTwentyHourLoan = await fetchLoans(
    blocks.main.mainTwentyHourBlock,
    mainnet_url
  )
  const allTwentyHourLoan = ovmTwentyHourLoan + mainTwentyHourLoan

  const ovmTwentyFourHourDebt = await fetchTVL(
    blocks.ovm.ovmTwentyFourHourBlock,
    optimism_url
  )
  const mainTwentyFourHourDebt = await fetchTVL(
    blocks.main.mainTwentyFourHourBlock,
    mainnet_url
  )
  const allTwentyFourHourDebt = ovmTwentyFourHourDebt + mainTwentyFourHourDebt

  const ovmTwentyFourHourWrapper = await fetchWrapper(
    blocks.ovm.ovmTwentyFourHourBlock,
    optimism_url
  )
  const mainTwentyFourHourWrapper = await fetchWrapper(
    blocks.main.mainTwentyFourHourBlock,
    mainnet_url
  )
  const allTwentyFourHourWrapper =
    ovmTwentyFourHourWrapper + mainTwentyFourHourWrapper

  const ovmTwentyFourHourLoan = await fetchLoans(
    blocks.ovm.ovmTwentyFourHourBlock,
    optimism_url
  )
  const mainTwentyFourHourLoan = await fetchLoans(
    blocks.main.mainTwentyFourHourBlock,
    mainnet_url
  )
  const allTwentyFourHourLoan = ovmTwentyFourHourLoan + mainTwentyFourHourLoan

  const ovmTwoDayDebt = await fetchTVL(blocks.ovm.ovmTwoDayBlock, optimism_url)
  const mainTwoDayDebt = await fetchTVL(
    blocks.main.mainTwoDayBlock,
    mainnet_url
  )
  const allTwoDayDebt = ovmTwoDayDebt + mainTwoDayDebt

  const ovmTwoDayWrapper = await fetchWrapper(
    blocks.ovm.ovmTwoDayBlock,
    optimism_url
  )
  const mainTwoDayWrapper = await fetchWrapper(
    blocks.main.mainTwoDayBlock,
    mainnet_url
  )
  const allTwoDayWrapper = ovmTwoDayWrapper + mainTwoDayWrapper

  const ovmTwoDayLoan = await fetchLoans(
    blocks.ovm.ovmTwoDayBlock,
    optimism_url
  )
  const mainTwoDayLoan = await fetchLoans(
    blocks.main.mainTwoDayBlock,
    mainnet_url
  )
  const allTwoDayLoan = ovmTwoDayLoan + mainTwoDayLoan

  const ovmThreeDayDebt = await fetchTVL(
    blocks.ovm.ovmThreeDayBlock,
    optimism_url
  )
  const mainThreeDayDebt = await fetchTVL(
    blocks.main.mainThreeDayBlock,
    mainnet_url
  )
  const allThreeDayDebt = ovmThreeDayDebt + mainThreeDayDebt

  const ovmThreeDayWrapper = await fetchWrapper(
    blocks.ovm.ovmThreeDayBlock,
    optimism_url
  )
  const mainThreeDayWrapper = await fetchWrapper(
    blocks.main.mainThreeDayBlock,
    mainnet_url
  )
  const allThreeDayWrapper = ovmThreeDayWrapper + mainThreeDayWrapper

  const ovmThreeDayLoan = await fetchLoans(
    blocks.ovm.ovmThreeDayBlock,
    optimism_url
  )
  const mainThreeDayLoan = await fetchLoans(
    blocks.main.mainThreeDayBlock,
    mainnet_url
  )
  const allThreeDayLoan = ovmThreeDayLoan + mainThreeDayLoan

  const ovmFourDayDebt = await fetchTVL(
    blocks.ovm.ovmFourDayBlock,
    optimism_url
  )
  const mainFourDayDebt = await fetchTVL(
    blocks.main.mainFourDayBlock,
    mainnet_url
  )
  const allFourDayDebt = ovmFourDayDebt + mainFourDayDebt

  const ovmFourDayWrapper = await fetchWrapper(
    blocks.ovm.ovmFourDayBlock,
    optimism_url
  )
  const mainFourDayWrapper = await fetchWrapper(
    blocks.main.mainFourDayBlock,
    mainnet_url
  )
  const allFourDayWrapper = ovmFourDayWrapper + mainFourDayWrapper

  const ovmFourDayLoan = await fetchLoans(
    blocks.ovm.ovmFourDayBlock,
    optimism_url
  )
  const mainFourDayLoan = await fetchLoans(
    blocks.main.mainFourDayBlock,
    mainnet_url
  )
  const allFourDayLoan = ovmFourDayLoan + mainFourDayLoan

  const ovmFiveDayDebt = await fetchTVL(
    blocks.ovm.ovmFiveDayBlock,
    optimism_url
  )
  const mainFiveDayDebt = await fetchTVL(
    blocks.main.mainFiveDayBlock,
    mainnet_url
  )
  const allFiveDayDebt = ovmFiveDayDebt + mainFiveDayDebt

  const ovmFiveDayWrapper = await fetchWrapper(
    blocks.ovm.ovmFiveDayBlock,
    optimism_url
  )
  const mainFiveDayWrapper = await fetchWrapper(
    blocks.main.mainFiveDayBlock,
    mainnet_url
  )
  const allFiveDayWrapper = ovmFiveDayWrapper + mainFiveDayWrapper

  const ovmFiveDayLoan = await fetchLoans(
    blocks.ovm.ovmFiveDayBlock,
    optimism_url
  )
  const mainFiveDayLoan = await fetchLoans(
    blocks.main.mainFiveDayBlock,
    mainnet_url
  )
  const allFiveDayLoan = ovmFiveDayLoan + mainFiveDayLoan

  const ovmSixDayDebt = await fetchTVL(blocks.ovm.ovmSixDayBlock, optimism_url)
  const mainSixDayDebt = await fetchTVL(
    blocks.main.mainSixDayBlock,
    mainnet_url
  )
  const allSixDayDebt = ovmSixDayDebt + mainSixDayDebt

  const ovmSixDayWrapper = await fetchWrapper(
    blocks.ovm.ovmSixDayBlock,
    optimism_url
  )
  const mainSixDayWrapper = await fetchWrapper(
    blocks.main.mainSixDayBlock,
    mainnet_url
  )
  const allSixDayWrapper = ovmSixDayWrapper + mainSixDayWrapper

  const ovmSixDayLoan = await fetchLoans(
    blocks.ovm.ovmSixDayBlock,
    optimism_url
  )
  const mainSixDayLoan = await fetchLoans(
    blocks.main.mainSixDayBlock,
    mainnet_url
  )
  const allSixDayLoan = ovmSixDayLoan + mainSixDayLoan

  const ovmTenDayDebt = await fetchTVL(blocks.ovm.ovmTenDayBlock, optimism_url)
  const mainTenDayDebt = await fetchTVL(
    blocks.main.mainTenDayBlock,
    mainnet_url
  )
  const allTenDayDebt = ovmTenDayDebt + mainTenDayDebt

  const ovmTenDayWrapper = await fetchWrapper(
    blocks.ovm.ovmTenDayBlock,
    optimism_url
  )
  const mainTenDayWrapper = await fetchWrapper(
    blocks.main.mainTenDayBlock,
    mainnet_url
  )
  const allTenDayWrapper = ovmTenDayWrapper + mainTenDayWrapper

  const ovmTenDayLoan = await fetchLoans(
    blocks.ovm.ovmTenDayBlock,
    optimism_url
  )
  const mainTenDayLoan = await fetchLoans(
    blocks.main.mainTenDayBlock,
    mainnet_url
  )
  const allTenDayLoan = ovmTenDayLoan + mainTenDayLoan

  const ovmFifteenDayDebt = await fetchTVL(
    blocks.ovm.ovmFifteenDayBlock,
    optimism_url
  )
  const mainFifteenDayDebt = await fetchTVL(
    blocks.main.mainFifteenDayBlock,
    mainnet_url
  )
  const allFifteenDayDebt = ovmFifteenDayDebt + mainFifteenDayDebt

  const ovmFifteenDayWrapper = await fetchWrapper(
    blocks.ovm.ovmFifteenDayBlock,
    optimism_url
  )
  const mainFifteenDayWrapper = await fetchWrapper(
    blocks.main.mainFifteenDayBlock,
    mainnet_url
  )
  const allFifteenDayWrapper = ovmFifteenDayWrapper + mainFifteenDayWrapper

  const ovmFifteenDayLoan = await fetchLoans(
    blocks.ovm.ovmFifteenDayBlock,
    optimism_url
  )
  const mainFifteenDayLoan = await fetchLoans(
    blocks.main.mainFifteenDayBlock,
    mainnet_url
  )
  const allFifteenDayLoan = ovmFifteenDayLoan + mainFifteenDayLoan

  const ovmTwentyDayDebt = await fetchTVL(
    blocks.ovm.ovmTwentyDayBlock,
    optimism_url
  )
  const mainTwentyDayDebt = await fetchTVL(
    blocks.main.mainTwentyDayBlock,
    mainnet_url
  )
  const allTwentyDayDebt = ovmTwentyDayDebt + mainTwentyDayDebt

  const ovmTwentyDayWrapper = await fetchWrapper(
    blocks.ovm.ovmTwentyDayBlock,
    optimism_url
  )
  const mainTwentyDayWrapper = await fetchWrapper(
    blocks.main.mainTwentyDayBlock,
    mainnet_url
  )
  const allTwentyDayWrapper = ovmTwentyDayWrapper + mainTwentyDayWrapper

  const ovmTwentyDayLoan = await fetchLoans(
    blocks.ovm.ovmTwentyDayBlock,
    optimism_url
  )
  const mainTwentyDayLoan = await fetchLoans(
    blocks.main.mainTwentyDayBlock,
    mainnet_url
  )
  const allTwentyDayLoan = ovmTwentyDayLoan + mainTwentyDayLoan

  const ovmTwentyFiveDayDebt = await fetchTVL(
    blocks.ovm.ovmTwentyFiveDayBlock,
    optimism_url
  )
  const mainTwentyFiveDayDebt = await fetchTVL(
    blocks.main.mainTwentyFiveDayBlock,
    mainnet_url
  )
  const allTwentyFiveDayDebt = ovmTwentyFiveDayDebt + mainTwentyFiveDayDebt

  const ovmTwentyFiveDayWrapper = await fetchWrapper(
    blocks.ovm.ovmTwentyFiveDayBlock,
    optimism_url
  )
  const mainTwentyFiveDayWrapper = await fetchWrapper(
    blocks.main.mainTwentyFiveDayBlock,
    mainnet_url
  )
  const allTwentyFiveDayWrapper =
    ovmTwentyFiveDayWrapper + mainTwentyFiveDayWrapper

  const ovmTwentyFiveDayLoan = await fetchLoans(
    blocks.ovm.ovmTwentyFiveDayBlock,
    optimism_url
  )
  const mainTwentyFiveDayLoan = await fetchLoans(
    blocks.main.mainTwentyFiveDayBlock,
    mainnet_url
  )
  const allTwentyFiveDayLoan = ovmTwentyFiveDayLoan + mainTwentyFiveDayLoan

  const ovmThirtyDayDebt = await fetchTVL(
    blocks.ovm.ovmThirtyDayBlock,
    optimism_url
  )
  const mainThirtyDayDebt = await fetchTVL(
    blocks.main.mainThirtyDayBlock,
    mainnet_url
  )
  const allThirtyDayDebt = ovmThirtyDayDebt + mainThirtyDayDebt

  const ovmThirtyDayWrapper = await fetchWrapper(
    blocks.ovm.ovmThirtyDayBlock,
    optimism_url
  )
  const mainThirtyDayWrapper = await fetchWrapper(
    blocks.main.mainThirtyDayBlock,
    mainnet_url
  )
  const allThirtyDayWrapper = ovmThirtyDayWrapper + mainThirtyDayWrapper

  const ovmThirtyDayLoan = await fetchLoans(
    blocks.ovm.ovmThirtyDayBlock,
    optimism_url
  )
  const mainThirtyDayLoan = await fetchLoans(
    blocks.main.mainThirtyDayBlock,
    mainnet_url
  )
  const allThirtyDayLoan = ovmThirtyDayLoan + mainThirtyDayLoan

  // create the charts

  const dayOvm = [
    {
      date: timeStamp.twentyFourHourAgo,
      debt: ovmTwentyFourHourDebt,
      wrapper: ovmTwentyFourHourWrapper,
      loan: ovmTwentyFourHourLoan,
    },
    {
      date: timeStamp.twentyHourAgo,
      debt: ovmTwentyHourDebt,
      wrapper: ovmTwentyHourWrapper,
      loan: ovmTwentyHourLoan,
    },
    {
      date: timeStamp.sixteenHourAgo,
      debt: ovmSixteenHourDebt,
      wrapper: ovmSixteenHourWrapper,
      loan: ovmSixteenHourLoan,
    },
    {
      date: timeStamp.twelveHourAgo,
      debt: ovmTwelveHourDebt,
      wrapper: ovmTwelveHourWrapper,
      loan: ovmTwelveHourLoan,
    },
    {
      date: timeStamp.eightHourAgo,
      debt: ovmEightHourDebt,
      wrapper: ovmEightHourWrapper,
      loan: ovmEightHourLoan,
    },
    {
      date: timeStamp.fourHourAgo,
      debt: ovmFourHourDebt,
      wrapper: ovmFourHourWrapper,
      loan: ovmFourHourLoan,
    },
    {
      date: timeStamp.noHourAgo,
      debt: ovmCurrentDebt,
      wrapper: ovmCurrentWrapper,
      loan: ovmCurrentLoan,
    },
  ]

  const dayMain = [
    {
      date: timeStamp.twentyFourHourAgo,
      debt: mainTwentyFourHourDebt,
      wrapper: mainTwentyFourHourWrapper,
      loan: mainTwentyFourHourLoan,
    },
    {
      date: timeStamp.twentyHourAgo,
      debt: mainTwentyHourDebt,
      wrapper: mainTwentyHourWrapper,
      loan: mainTwentyHourLoan,
    },
    {
      date: timeStamp.sixteenHourAgo,
      debt: mainSixteenHourDebt,
      wrapper: mainSixteenHourWrapper,
      loan: mainSixteenHourLoan,
    },
    {
      date: timeStamp.twelveHourAgo,
      debt: mainTwelveHourDebt,
      wrapper: mainTwelveHourWrapper,
      loan: mainTwelveHourLoan,
    },
    {
      date: timeStamp.eightHourAgo,
      debt: mainEightHourDebt,
      wrapper: mainEightHourWrapper,
      loan: mainEightHourLoan,
    },
    {
      date: timeStamp.fourHourAgo,
      debt: mainFourHourDebt,
      wrapper: mainFourHourWrapper,
      loan: mainFourHourLoan,
    },
    {
      date: timeStamp.noHourAgo,
      debt: mainCurrentDebt,
      wrapper: mainCurrentWrapper,
      loan: mainCurrentLoan,
    },
  ]

  const dayAll = [
    {
      date: timeStamp.twentyFourHourAgo,
      debt: allTwentyFourHourDebt,
      wrapper: allTwentyFourHourWrapper,
      loan: allTwentyFourHourLoan,
    },
    {
      date: timeStamp.twentyHourAgo,
      debt: allTwentyHourDebt,
      wrapper: allTWentyHourWrapper,
      loan: allTwentyHourLoan,
    },
    {
      date: timeStamp.sixteenHourAgo,
      debt: allSixteenHourDebt,
      wrapper: allSixteenHourWrapper,
      loan: allSixteenHourLoan,
    },
    {
      date: timeStamp.twelveHourAgo,
      debt: allTwelveHourDebt,
      wrapper: allTwelveHourWrapper,
      loan: allTwelveHourLoan,
    },
    {
      date: timeStamp.eightHourAgo,
      debt: allEightHourDebt,
      wrapper: allEightHourWrapper,
      loan: allEightHourLoan,
    },
    {
      date: timeStamp.fourHourAgo,
      debt: allFourHourDebt,
      wrapper: allFourHourWrapper,
      loan: allFourHourLoan,
    },
    {
      date: timeStamp.noHourAgo,
      debt: allCurrentDebt,
      wrapper: allCurrentWrapper,
      loan: allCurrentLoan,
    },
  ]

  const weekOvm = [
    {
      date: timeStamp.sixDayAgo,
      debt: ovmSixDayDebt,
      wrapper: ovmSixDayWrapper,
      loan: ovmSixDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: ovmFiveDayDebt,
      wrapper: ovmFiveDayWrapper,
      loan: ovmFiveDayLoan,
    },
    {
      date: timeStamp.fourDayAgo,
      debt: ovmFourDayDebt,
      wrapper: ovmFourDayWrapper,
      loan: ovmFourDayLoan,
    },
    {
      date: timeStamp.threeDayAgo,
      debt: ovmThreeDayDebt,
      wrapper: ovmThreeDayWrapper,
      loan: ovmThreeDayLoan,
    },
    {
      date: timeStamp.twoDayAgo,
      debt: ovmTwoDayDebt,
      wrapper: ovmTwoDayWrapper,
      loan: ovmTwoDayLoan,
    },
    {
      date: timeStamp.oneDayAgo,
      debt: ovmTwentyFourHourDebt,
      wrapper: ovmTwentyFourHourWrapper,
      loan: ovmTwentyFourHourLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: ovmCurrentDebt,
      wrapper: ovmCurrentWrapper,
      loan: ovmCurrentLoan,
    },
  ]

  const weekMain = [
    {
      date: timeStamp.sixDayAgo,
      debt: mainSixDayDebt,
      wrapper: mainSixDayWrapper,
      loan: mainSixDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: mainFiveDayDebt,
      wrapper: mainFiveDayWrapper,
      loan: mainFiveDayLoan,
    },
    {
      date: timeStamp.fourDayAgo,
      debt: mainFourDayDebt,
      wrapper: mainFourDayWrapper,
      loan: mainFourDayLoan,
    },
    {
      date: timeStamp.threeDayAgo,
      debt: mainThreeDayDebt,
      wrapper: mainThreeDayWrapper,
      loan: mainThreeDayLoan,
    },
    {
      date: timeStamp.twoDayAgo,
      debt: mainTwoDayDebt,
      wrapper: mainTwoDayWrapper,
      loan: mainTwoDayLoan,
    },
    {
      date: timeStamp.oneDayAgo,
      debt: mainTwentyFourHourDebt,
      wrapper: mainTwentyFourHourWrapper,
      loan: mainTwentyFourHourLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: mainCurrentDebt,
      wrapper: mainCurrentWrapper,
      loan: mainCurrentLoan,
    },
  ]

  const weekAll = [
    {
      date: timeStamp.sixDayAgo,
      debt: allSixDayDebt,
      wrapper: allSixDayWrapper,
      loan: allSixDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: allFiveDayDebt,
      wrapper: allFiveDayWrapper,
      loan: allFiveDayLoan,
    },
    {
      date: timeStamp.fourDayAgo,
      debt: allFourDayDebt,
      wrapper: allFourDayWrapper,
      loan: allFourDayLoan,
    },
    {
      date: timeStamp.threeDayAgo,
      debt: allThreeDayDebt,
      wrapper: allThreeDayWrapper,
      loan: allThreeDayLoan,
    },
    {
      date: timeStamp.twoDayAgo,
      debt: allTwoDayDebt,
      wrapper: allTwoDayWrapper,
      loan: allTwoDayLoan,
    },
    {
      date: timeStamp.oneDayAgo,
      debt: allTwentyFourHourDebt,
      wrapper: allTwentyFourHourWrapper,
      loan: allTwentyFourHourLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: allCurrentDebt,
      wrapper: allCurrentWrapper,
      loan: allCurrentLoan,
    },
  ]

  const monthOvm = [
    {
      date: timeStamp.thirtyDayAgo,
      debt: ovmThirtyDayDebt,
      wrapper: ovmThirtyDayWrapper,
      loan: ovmThirtyDayLoan,
    },
    {
      date: timeStamp.twentyFiveDayAgo,
      debt: ovmTwentyFiveDayDebt,
      wrapper: ovmTwentyFiveDayWrapper,
      loan: ovmTwentyFiveDayLoan,
    },
    {
      date: timeStamp.twentyDayAgo,
      debt: ovmTwentyDayDebt,
      wrapper: ovmTwentyDayWrapper,
      loan: ovmTwentyDayLoan,
    },
    {
      date: timeStamp.fifteenDayAgo,
      debt: ovmFifteenDayDebt,
      wrapper: ovmFifteenDayWrapper,
      loan: ovmFifteenDayLoan,
    },
    {
      date: timeStamp.tenDayAgo,
      debt: ovmTenDayDebt,
      wrapper: ovmTenDayWrapper,
      loan: ovmTenDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: ovmFiveDayDebt,
      wrapper: ovmFiveDayWrapper,
      loan: ovmFiveDayLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: ovmCurrentDebt,
      wrapper: ovmCurrentWrapper,
      loan: ovmCurrentLoan,
    },
  ]

  const monthMain = [
    {
      date: timeStamp.thirtyDayAgo,
      debt: mainThirtyDayDebt,
      wrapper: mainThirtyDayWrapper,
      loan: mainThirtyDayLoan,
    },
    {
      date: timeStamp.twentyFiveDayAgo,
      debt: mainTwentyFiveDayDebt,
      wrapper: mainTwentyFiveDayWrapper,
      loan: mainTwentyFiveDayLoan,
    },
    {
      date: timeStamp.twentyDayAgo,
      debt: mainTwentyDayDebt,
      wrapper: mainTwentyDayWrapper,
      loan: mainTwentyDayLoan,
    },
    {
      date: timeStamp.fifteenDayAgo,
      debt: mainFifteenDayDebt,
      wrapper: mainFifteenDayWrapper,
      loan: mainFifteenDayLoan,
    },
    {
      date: timeStamp.tenDayAgo,
      debt: mainTenDayDebt,
      wrapper: mainTenDayWrapper,
      loan: mainTenDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: mainFiveDayDebt,
      wrapper: mainFiveDayWrapper,
      loan: mainFiveDayLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: mainCurrentDebt,
      wrapper: mainCurrentWrapper,
      loan: mainCurrentLoan,
    },
  ]

  const monthAll = [
    {
      date: timeStamp.thirtyDayAgo,
      debt: allThirtyDayDebt,
      wrapper: allThirtyDayWrapper,
      loan: allThirtyDayLoan,
    },
    {
      date: timeStamp.twentyFiveDayAgo,
      debt: allTwentyFiveDayDebt,
      wrapper: allTwentyFiveDayWrapper,
      loan: allTwentyFiveDayLoan,
    },
    {
      date: timeStamp.twentyDayAgo,
      debt: allTwentyDayDebt,
      wrapper: allTwentyDayWrapper,
      loan: allTwentyDayLoan,
    },
    {
      date: timeStamp.fifteenDayAgo,
      debt: allFifteenDayDebt,
      wrapper: allFifteenDayWrapper,
      loan: allFifteenDayLoan,
    },
    {
      date: timeStamp.tenDayAgo,
      debt: allTenDayDebt,
      wrapper: allTenDayWrapper,
      loan: allTenDayLoan,
    },
    {
      date: timeStamp.fiveDayAgo,
      debt: allFiveDayDebt,
      wrapper: allFiveDayWrapper,
      loan: allFiveDayLoan,
    },
    {
      date: timeStamp.currentDay,
      debt: allCurrentDebt,
      wrapper: allCurrentWrapper,
      loan: allCurrentLoan,
    },
  ]

  return {
    dayOvm,
    dayMain,
    dayAll,
    weekOvm,
    weekMain,
    weekAll,
    monthOvm,
    monthMain,
    monthAll,
    allCurrentDebt,
    allCurrentWrapper,
    ovmCurrentDebt,
    ovmCurrentWrapper,
    mainCurrentDebt,
    mainCurrentWrapper,
    ovmCurrentLoan,
    mainCurrentLoan,
    allCurrentLoan,
  }
}

export const fetchMainnetTVL = async (block: number) =>
  await fetchTVL(block, mainnet_url)
export const fetchOVMTVL = async (block: number) =>
  await fetchTVL(block, optimism_url)

export const fetchMainnetWrapper = async (block: number) =>
  await fetchWrapper(block, mainnet_url)
export const fetchOVMWrapper = async (block: number) =>
  await fetchWrapper(block, optimism_url)

export const fetchMainnetLoans = async (block: number) =>
  await fetchLoans(block, mainnet_url)
export const fetchOVMLoans = async (block: number) =>
  await fetchLoans(block, optimism_url)