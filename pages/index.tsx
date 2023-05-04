import NodeCache from 'node-cache'

import NetworkNavBar from '../components/network/NetworkNavBar'
import Subheader from '../components/subheader/Subheader'
import { useState } from 'react'
import { getTVL } from '../lib/getTVL'
import {
  TVLData,
  TVLQueryRow,
  divide,
  divideInflation,
  divideTVL,
} from '../lib/getDune'
import styles from '../styles/Main.module.css'
import SnxStaked from '../components/data/snxStaked/SnxStaked'
import TotalValueLocked from '../components/data/tvl/TotalValueLocked'
import Volumes from '../components/data/volumes/Volumes'
import Fees from '../components/data/fees/Fees'
import NumStaker from '../components/data/numStaker/numStaker'
import Inflation from '../components/data/inflation/Inflation'
import { staker } from '../lib/getStaker'
import MoreStats from '../components/data/moreStats/MoreStats'
import StartStaking from '../components/data/startStaking/StartStaking'
import DUNE from '../constants/dune'
import { createFetchWithRetry } from '../lib/getDuneData'

import { getTVLLoan } from '../lib/getTVLLoanWrapperOnChain'
import convertTVL from '../lib/helper/convertTVL'
import convertVolumes from '../lib/helper/convertVolumes'
import convertFees from '../lib/helper/convertFees'

const Home = (props: any) => {
  const [netId, setNetId] = useState<number>(20)

  const handleNetwork = (buttons: any) => {
    setNetId(buttons.id)
  }

  const duneSNXStaker = props.duneSNXUsers.latestResult
  const duneSNXStakerRows = divide(props.duneSNXUsers.resultRows)

  const stake = props.stake

  const duneTVLRows = divideTVL(props.duneSNXTVL.resultRows) as TVLData
  const duneTVL = props.duneSNXTVL.latestResult as TVLQueryRow
  const inflation = props.duneSNXInflation.latestResult
  const duneInflationRows = divideInflation(props.duneSNXInflation.resultRows)
  const duneFees = convertFees(props.duneFees.resultRows)
  const duneVolumeRows = convertVolumes(props.duneVolumes.resultRows)

  return (
    <div>
      <Subheader />
      <NetworkNavBar handle={handleNetwork} current={netId} />

      <div className={styles.container}>
        <SnxStaked
          click={netId}
          percentStakeAll={stake.percentStakedAll}
          percentStakeMain={stake.percentStakedMain}
          percentStakeOvm={stake.percentStakedOvm}
          stakeAmountAll={stake.totalStakeAll}
          stakeAmountMain={stake.totalStakeMain}
          stakeAmountOvm={stake.totalStakeOvm}
          stakeValueAll={stake.stakeValueAll}
          stakeValueMain={stake.stakeValueMain}
          stakeValueOvm={stake.stakeValueOvm}
        />

        <TotalValueLocked
          dayDataOvm={duneTVLRows.dayOvm}
          weekDataOvm={duneTVLRows.weekOvm}
          monthDataOvm={duneTVLRows.monthOvm}
          totalDebtOvm={duneTVL.L2_stake_debt}
          totalWrapperOvm={0}
          dayDataMain={duneTVLRows.dayMain}
          weekDataMain={duneTVLRows.weekMain}
          monthDataMain={duneTVLRows.monthMain}
          totalDebtMain={duneTVL.L1_stake_debt}
          totalWrapperMain={0}
          dayDataAll={duneTVLRows.dayAll}
          weekDataAll={duneTVLRows.weekAll}
          monthDataAll={duneTVLRows.monthAll}
          totalLoanMain={duneTVL.TVL_L1_Staked}
          totalLoanOvm={duneTVL.TVL_L2_Staked}
          totalDataOvm={duneTVLRows.totalOvm}
          totalDataMain={duneTVLRows.totalMain}
          totalDataAll={duneTVLRows.totalAll}
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
          totalAll={duneSNXStakerRows.totalAll || []}
          totalMain={duneSNXStakerRows.totalMain || []}
          totalOvm={duneSNXStakerRows.totalOvm || []}
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
          inflationDataMain={duneInflationRows.inflationDataMain || []}
          inflationDataOvm={duneInflationRows.inflationDataOvm || []}
          inflationDataAll={duneInflationRows.inflationDataAll || []}
        />

        <Volumes
          latestResult={props.duneVolumes.latestResult}
          dataAll={duneVolumeRows.dataAll}
          dayDataAll={duneVolumeRows.dayData}
          weekDataAll={duneVolumeRows.weekData}
          monthDataAll={duneVolumeRows.monthData}
          click={netId}
        />
        <Fees
          click={netId}
          latestResult={props.duneFees.latestResult}
          dayDataAll={duneFees.dayData}
          weekDataAll={duneFees.weekData}
          monthDataAll={duneFees.monthData}
          dataAll={duneFees.dataAll}
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
  const duneSNXTVL = (await createFetchWithRetry(DUNE.SNX_TVL, cache)()) as {
    resultRows: any[]
    latestResult: any
  }
  const duneSNXInflation = await createFetchWithRetry(
    DUNE.SNX_INFLATION,
    cache
  )()

  const stake = await staker()

  const params = { query_parameters: { 'Time scale': 'day' } }
  const duneSNXTrading = await createFetchWithRetry(
    DUNE.SNX_TRADING_FEE,
    cache,
    JSON.stringify(params)
  )()

  const duneVolumes = await createFetchWithRetry(
    DUNE.SNX_VOLUMES,
    cache,
    JSON.stringify({ query_parameters: { Interval: '365 days' } })
  )()

  const duneFees = await createFetchWithRetry(
    DUNE.SNX_FEES,
    cache,
    JSON.stringify({ query_parameters: { Interval: '365 days' } })
  )()

  return {
    props: {
      duneSNXUsers,
      stake,
      duneSNXTVL,
      duneSNXInflation,
      duneSNXTrading,
      duneFees,
      duneVolumes,
    },
  }
}
