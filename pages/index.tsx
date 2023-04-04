import NodeCache from 'node-cache'

import NetworkNavBar from '../components/network/NetworkNavBar'
import Subheader from '../components/subheader/Subheader'
import { useEffect, useState } from 'react'
import { fetchOVMLoans, getTVL } from '../lib/getTVL'
import { divide, divideInflation, divideTVL } from '../lib/getDune'
import styles from '../styles/Main.module.css'
import SnxStaked from '../components/data/snxStaked/SnxStaked'
import TotalValueLocked from '../components/data/tvl/TotalValueLocked'
import StakeAPY from '../components/data/stakeAPY/StakeAPY'
import NumStaker from '../components/data/numStaker/numStaker'
import TradeActivity from '../components/data/tradeActivity/TradeActivity'
import Inflation from '../components/data/inflation/Inflation'
import TradeFee from '../components/data/tradeFee/TradeFee'
import { staker } from '../lib/getStaker'
import { tradeData } from '../lib/getTradeData'
import MoreStats from '../components/data/moreStats/MoreStats'
import StartStaking from '../components/data/startStaking/StartStaking'
import DUNE from '../constants/dune'
import { createFetchWithRetry } from '../lib/getDuneData'

import { getTVLLoan } from '../lib/getTVLLoanWrapperOnChain'
import convertTVL from '../lib/helper/convertTVL'
import getDuneTrade from '../lib/duneData/getDuneTrade'

const Home = (props: any) => {
  const [netId, setNetId] = useState<number>(20)

  const handleNetwork = (buttons: any) => {
    setNetId(buttons.id)
  }
  const duneTrade = getDuneTrade(props.duneSNXTrading.resultRows)

  const duneSNXStakerRows = divide(props.duneSNXUsers.resultRows)
  const duneInflationRows = divideInflation(props.duneSNXInflation.resultRows)
  const duneSNXStaker = props.duneSNXUsers.latestResult
  const staking = props.duneSNXStaking.latestResult
  const inflation = props.duneSNXInflation.latestResult
  const duneTVLRows = props.duneSNXTVL.resultRows
  console.log(netId)

  return (
    <div>
      <Subheader />
      <NetworkNavBar handle={handleNetwork} current={netId} />

      <div className={styles.container}>
        <SnxStaked
          click={netId}
          percentStakeAll={staking.Total_stake_ratio / 100}
          percentStakeMain={staking.L1_stake_ratio / 100}
          percentStakeOvm={staking.L2_stake_ratio / 100}
          stakeAmountAll={staking.TVL_staked / staking.SNX_price}
          stakeAmountMain={staking.TVL_L1_Staked / staking.SNX_price}
          stakeAmountOvm={staking.TVL_L2_Staked / staking.SNX_price}
          stakeValueAll={staking.TVL_staked}
          stakeValueMain={staking.TVL_L1_Staked}
          stakeValueOvm={staking.TVL_L2_Staked}
        />

        <TotalValueLocked
          dayDataOvm={duneTVLRows.dayOvm || props.theTVL.dayOvm}
          weekDataOvm={duneTVLRows.weekOvm || props.theTVL.weekOvm}
          monthDataOvm={duneTVLRows.monthOvm || props.theTVL.monthOvm}
          totalDebtOvm={props.theTVL.ovmCurrentDebt}
          totalWrapperOvm={props.theTVL.ovmCurrentWrapper}
          dayDataMain={duneTVLRows.dayMain || props.theTVL.dayMain}
          weekDataMain={duneTVLRows.weekMain || props.theTVL.weekMain}
          monthDataMain={duneTVLRows.monthMain || props.theTVL.monthMain}
          totalDebtMain={props.theTVL.mainCurrentDebt}
          totalWrapperMain={props.theTVL.mainCurrentWrapper}
          dayDataAll={duneTVLRows.dayAll || props.theTVL.dayAll}
          weekDataAll={duneTVLRows.weekAll || props.theTVL.weekAll}
          monthDataAll={duneTVLRows.monthAll || props.theTVL.monthAll}
          totalLoanMain={props.theTVL.mainCurrentLoan}
          totalLoanOvm={props.theTVL.ovmCurrentLoan}
          click={netId}
        />
        <NumStaker
          click={netId}
          currentStakerAll={duneSNXStaker.cumulative_evt}
          currentStakerMain={duneSNXStaker.cumulative_L1_evt}
          currentStakerOvm={duneSNXStaker.cumulative_L2_evt}
          dayAll={duneSNXStakerRows.dayAll || []}
          dayMain={duneSNXStakerRows.dayMain || []}
          dayOvm={duneSNXStakerRows.dayOvm || []}
          weekAll={duneSNXStakerRows.weekAll || []}
          weekMain={duneSNXStakerRows.weekMain || []}
          weekOvm={duneSNXStakerRows.weekOvm || []}
          monthAll={duneSNXStakerRows.monthAll || []}
          monthMain={duneSNXStakerRows.monthMain || []}
          monthOvm={duneSNXStakerRows.monthOvm || []}
        />

        {/* <TradeActivity
          click={netId}
          tradeDataMain={props.trades.tradeDataMain}
          tradeDataOvm={props.trades.tradeDataOvm}
          totalVolMain={props.trades.totalVolMain}
          totalTradeMain={props.trades.totalTradeMain}
          totalVolOvm={props.trades.totalVolOvm}
          totalTradeOvm={props.trades.totalTradeOvm}
          tradeDataAll={props.trades.allTotalTradeData}
          sevenTradeDataMain={props.trades.sevenTradeDataMain}
          sevenTradeDataOvm={props.trades.sevenTradeDataOvm}
          thirtyTradeDataMain={props.trades.thirtyTradeDataMain}
          thirtyTradeDataOvm={props.trades.thirtyTradeDataOvm}
          ninetyTradeDataMain={props.trades.ninetyTradeDataMain}
          ninetyTradeDataOvm={props.trades.ninetyTradeDataOvm}
          dailyTradeDataMain={props.trades.dailyTradeDataMain}
          dailyTradeDataOvm={props.trades.dailyTradeDataOvm}
          allDailyTradeData={props.trades.allDailyTradeData}
          allSevenTradeData={props.trades.allSevenTradeData}
          allThirtyTradeData={props.trades.allThirtyTradeData}
          allNinetyTradeData={props.trades.allNinetyTradeData}
          dailyVolOvm={props.trades.dailyTotalVolOvm}
          dailyVolMain={props.trades.dailyTotalVolMain}
          sevenVolMain={props.trades.sevenTotalVolMain}
          sevenVolOvm={props.trades.sevenTotalVolOvm}
          thirtyVolMain={props.trades.thirtyTotalVolMain}
          thirtyVolOvm={props.trades.thirtyTotalVolOvm}
          ninetyVolMain={props.trades.ninetyTotalVolMain}
          ninetyVolOvm={props.trades.ninetyTotalVolOvm}
          dailyTradeOvm={props.trades.dailyTotalTradeOvm}
          dailyTradeMain={props.trades.dailyTotalTradeMain}
          sevenTradeOvm={props.trades.sevenTotalTradeOvm}
          sevenTradeMain={props.trades.sevenTotalTradeMain}
          thirtyTradeOvm={props.trades.thirtyTotalTradeOvm}
          thirtyTradeMain={props.trades.thirtyTotalTradeMain}
          ninetyTradeOvm={props.trades.ninetyTotalTradeOvm}
          ninetyTradeMain={props.trades.ninetyTotalTradeMain}
        /> */}

        <Inflation
          click={netId}
          currentRewardMain={
            inflation.L1_totalSupply - inflation.L1_totalSupply_t0
          }
          currentRewardOvm={
            inflation.L2_totalSupply - inflation.L2_totalSupply_t0
          }
          currentRewardAll={
            inflation.SNX_totalSupply - inflation.SNX_totalSupply_t0
          }
          allTimeInflationMain={props.stake.rewardsAmountMain}
          allTimeInflationOvm={props.stake.rewardsAmountOvm}
          allTimeInflationAll={props.stake.rewardsAmountAll}
          inflationDataMain={duneInflationRows.inflationDataMain || []}
          inflationDataOvm={duneInflationRows.inflationDataOvm || []}
          inflationDataAll={duneInflationRows.inflationDataAll || []}
        />

        {netId === 20 && (
          <TradeFee
            click={netId}
            totalFeeAll={duneTrade.wholeTimeFees.projects}
            totalFeeMain={props.trades.totalFeeMain}
            totalFeeOvm={props.trades.totalFeeOvm}
            dailyFeeMain={props.trades.dailyTotalFeeMain}
            dailyFeeOvm={props.trades.dailyTotalFeeOvm}
            sevenFeeMain={props.trades.sevenTotalFeeMain}
            sevenFeeOvm={props.trades.sevenTotalFeeOvm}
            thirtyFeeMain={props.trades.thirtyTotalFeeMain}
            thirtyFeeOvm={props.trades.thirtyTotalFeeOvm}
            ninetyFeeMain={props.trades.ninetyTotalFeeMain}
            ninetyFeeOvm={props.trades.ninetyTotalFeeOvm}
            allDailyFee={duneTrade.dayFees.projects}
            allSevenFee={duneTrade.weekFees.projects}
            allThirtyFee={duneTrade.monthFees.projects}
            allNinetyFee={duneTrade.threeMonthesFees.projects}
            feeAll={duneTrade.wholeTimeFees.totalFee}
            feeMain={props.trades.feeCollectMain}
            feeOvm={props.trades.feeCollectOvm}
            dailyFeeCollectOvm={props.trades.dailyFeeCollectOvm}
            dailyFeeCollectMain={props.trades.dailyFeeCollectMain}
            allDailyFeeCollect={duneTrade.dayFees.totalFee}
            sevenFeeCollectMain={props.trades.sevenFeeCollectMain}
            sevenFeeCollectOvm={props.trades.sevenFeeCollectOvm}
            allSevenFeeCollect={duneTrade.weekFees.totalFee}
            thirtyFeeCollectMain={props.trades.thirtyFeeCollectMain}
            thirtyFeeCollectOvm={props.trades.thirtyFeeCollectOvm}
            allThirtyFeeCollect={duneTrade.monthFees.totalFee}
            ninetyFeeCollectMain={props.trades.ninetyFeeCollectMain}
            ninetyFeeCollectOvm={props.trades.ninetyFeeCollectOvm}
            allNinetyFeeCollect={duneTrade.threeMonthesFees.totalFee}
          />
        )}

        <MoreStats />
        <StartStaking />
      </div>
    </div>
  )
}

export default Home

// export async function getStaticProps() {
//   const cache = new NodeCache({ stdTTL: 86400 })

//   const params = { query_parameters: { 'Time scale': 'day' } }

//   const duneSNXTrading = await createFetchWithRetry(
//     DUNE.SNX_TRADING_FEE,
//     cache,
//     JSON.stringify(params)
//   )()
//   const trades = await tradeData()

//   return {
//     props: {
//       duneSNXTrading,
//       trades,
//     },
//   }
// }

const cache = new NodeCache({ stdTTL: 86400 })

export async function getStaticProps() {
  const duneSNXUsers = await createFetchWithRetry(DUNE.SNX_USERS, cache)()
  const duneSNXStaking = await createFetchWithRetry(DUNE.SNX_STAKING, cache)()
  const duneSNXInflation = await createFetchWithRetry(
    DUNE.SNX_INFLATION,
    cache
  )()
  const duneSNXTVL = (await createFetchWithRetry(DUNE.SNX_TVL, cache)()) as {
    resultRows: any[]
    latestResult: any
  }

  // const trades = await tradeData()
  const stake = await staker()
  const theTVL = await getTVL()
  const onChain = await getTVLLoan()
  const duneTVLRows = convertTVL(duneSNXTVL.resultRows, onChain)

  const params = { query_parameters: { 'Time scale': 'day' } }
  const duneSNXTrading = await createFetchWithRetry(
    DUNE.SNX_TRADING_FEE,
    cache,
    JSON.stringify(params)
  )()
  return {
    props: {
      duneSNXUsers,
      duneSNXStaking,
      duneSNXInflation,
      duneSNXTrading,
      duneSNXTVL: {
        latestRow: duneSNXTVL.latestResult,
        resultRows: duneTVLRows,
      },
      theTVL,
      stake,
      trades: {},
    },
  }
}
