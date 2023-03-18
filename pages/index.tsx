import NodeCache from 'node-cache'

import NetworkNavBar from '../components/network/NetworkNavBar'
import Subheader from '../components/subheader/Subheader'
import { useState } from 'react'
import { getTVL } from '../lib/getTVL'
import { useDuneFetch, divide, divideInflation } from '../lib/getDune'
import styles from '../styles/Main.module.css'
import SnxStaked from '../components/data/snxStaked/SnxStaked'
import TotalValueLocked from '../components/data/tvl/TotalValueLocked'
import StakeAPY from '../components/data/stakeAPY/StakeAPY'
import NumStaker from '../components/data/numStaker/numStaker'
import TradeActivity from '../components/data/tradeActivity/TradeActivity'
import Inflation from '../components/data/inflation/Inflation'
import TradeFee from '../components/data/tradeFee/TradeFee'
import { staker } from '../lib/getStaker'
import { numStaker } from '../lib/getNumStaker'
import { tradeData } from '../lib/getTradeData'
import MoreStats from '../components/data/moreStats/MoreStats'
import StartStaking from '../components/data/startStaking/StartStaking'
import DUNE from '../constants/dune'
import { createFetchWithRetry } from '../lib/getDuneData'

const Home = (props: any) => {
  const [netId, setNetId] = useState<number>(20)

  const handleNetwork = (buttons: any) => {
    setNetId(buttons.id)
  }

  const duneSNXStakerRows = divide(props.duneSNXUsers.resultRows)
  const duneInflationRows = divideInflation(props.duneSNXInflation.resultRows)
  const duneSNXStaker = props.duneSNXUsers.latestResult
  const staking = props.duneSNXStaking.latestResult
  const inflation = props.duneSNXInflation.latestResult

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
          dayDataOvm={props.theTVL.dayOvm}
          weekDataOvm={props.theTVL.weekOvm}
          monthDataOvm={props.theTVL.monthOvm}
          totalDebtOvm={props.theTVL.ovmCurrentDebt}
          totalWrapperOvm={props.theTVL.ovmCurrentWrapper}
          dayDataMain={props.theTVL.dayMain}
          weekDataMain={props.theTVL.weekMain}
          monthDataMain={props.theTVL.monthMain}
          totalDebtMain={props.theTVL.mainCurrentDebt}
          totalWrapperMain={props.theTVL.mainCurrentWrapper}
          dayDataAll={props.theTVL.dayAll}
          weekDataAll={props.theTVL.weekAll}
          monthDataAll={props.theTVL.monthAll}
          totalLoanMain={props.theTVL.mainCurrentLoan}
          totalLoanOvm={props.theTVL.ovmCurrentLoan}
          click={netId}
        />
        <StakeAPY
          click={netId}
          avg={props.stake.apyAvg}
          ovm={props.stake.apyOvm}
          main={props.stake.apyMain}
        />
        <NumStaker
          click={netId}
          currentStakerAll={duneSNXStaker.cumulative_evt}
          currentStakerMain={duneSNXStaker.cumulative_L1_evt}
          currentStakerOvm={duneSNXStaker.cumulative_L2_evt}
          dayAll={duneSNXStakerRows.dayAll}
          dayMain={duneSNXStakerRows.dayMain}
          dayOvm={duneSNXStakerRows.dayOvm}
          weekAll={duneSNXStakerRows.weekAll}
          weekMain={duneSNXStakerRows.weekMain}
          weekOvm={duneSNXStakerRows.weekOvm}
          monthAll={duneSNXStakerRows.monthAll}
          monthMain={duneSNXStakerRows.monthMain}
          monthOvm={duneSNXStakerRows.monthOvm}
        />

        <TradeActivity
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
        />

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
          inflationDataMain={duneInflationRows.inflationDataMain}
          inflationDataOvm={duneInflationRows.inflationDataOvm}
          inflationDataAll={duneInflationRows.inflationDataAll}
        />

        <TradeFee
          click={netId}
          totalFeeAll={props.trades.allTotalFee}
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
          allDailyFee={props.trades.allDailyFee}
          allSevenFee={props.trades.allSevenFee}
          allThirtyFee={props.trades.allThirtyFee}
          allNinetyFee={props.trades.allNinetyFee}
          feeAll={props.trades.feeCollectAll}
          feeMain={props.trades.feeCollectMain}
          feeOvm={props.trades.feeCollectOvm}
          dailyFeeCollectOvm={props.trades.dailyFeeCollectOvm}
          dailyFeeCollectMain={props.trades.dailyFeeCollectMain}
          allDailyFeeCollect={props.trades.allDailyFeeCollect}
          sevenFeeCollectMain={props.trades.sevenFeeCollectMain}
          sevenFeeCollectOvm={props.trades.sevenFeeCollectOvm}
          allSevenFeeCollect={props.trades.allSevenFeeCollect}
          thirtyFeeCollectMain={props.trades.thirtyFeeCollectMain}
          thirtyFeeCollectOvm={props.trades.thirtyFeeCollectOvm}
          allThirtyFeeCollect={props.trades.allThirtyFeeCollect}
          ninetyFeeCollectMain={props.trades.ninetyFeeCollectMain}
          ninetyFeeCollectOvm={props.trades.ninetyFeeCollectOvm}
          allNinetyFeeCollect={props.trades.allNinetyFeeCollect}
        />

        <MoreStats />
        <StartStaking />
      </div>
    </div>
  )
}

export default Home

const cache = new NodeCache({ stdTTL: 86400 })

export async function getStaticProps() {
  const duneSNXUsers = await createFetchWithRetry(DUNE.SNX_USERS, cache)()
  const duneSNXStaking = await createFetchWithRetry(DUNE.SNX_STAKING, cache)()
  const duneSNXInflation = await createFetchWithRetry(
    DUNE.SNX_INFLATION,
    cache
  )()

  const stake = await staker()
  const trades = await tradeData()
  const theTVL = await getTVL()

  return {
    props: {
      duneSNXUsers,
      duneSNXStaking,
      duneSNXInflation,
      theTVL,
      stake,
      trades,
    },
  }
}
