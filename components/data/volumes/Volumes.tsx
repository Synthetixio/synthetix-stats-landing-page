import styles from './TotalValueLocked.module.css'

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { useState } from 'react'
import { formatMoney } from '../../../constants/format'
import CustomToolTip from './tooltip'
import { RiInformationFill } from 'react-icons/ri'
import InfoTooltip from '../../infoToolTip/InfoTooltip'
import Dropdown from '../../dropdown/Dropdown'
import { DisplayRow } from '../../../lib/helper/convertVolumes'

interface TVL {
  dayDataAll: DisplayRow[]
  weekDataAll: DisplayRow[]
  monthDataAll: DisplayRow[]
  latestResult: DisplayRow
  click: number
}

const TotalValueLocked = ({
  dayDataAll,
  weekDataAll,
  monthDataAll,
  latestResult,
}: TVL) => {
  const optionMap = [
    { value: 1, label: '1 Day' },
    { value: 2, label: '1 Week' },
    { value: 3, label: '1 Month' },
  ]

  const [timeFrame, setTimeFrame] = useState(1)

  const handleActive = (option: any) => {
    setTimeFrame(option.value)
  }

  // click === 1 ? mainnet : click === 10 ? optimism : click === 21 ? all networks
  const { total_volume, PERPv1_vol, PERPv2_vol, atomic_volume } = latestResult
  const totalVolume = formatMoney.format(total_volume)

  const perpV1Volume = formatMoney.format(PERPv1_vol)
  const perpV2Volume = formatMoney.format(PERPv2_vol)
  const atomicVolume = formatMoney.format(atomic_volume)

  const allData =
    timeFrame === 1 ? dayDataAll : timeFrame === 2 ? weekDataAll : monthDataAll

  const ttInfo = `Total Value Locked within SNX Ecosystem. Updated every 15 minutes`

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.tvl}>Synthetix Total Volumes</h3>
            <InfoTooltip content={ttInfo}>
              <span className={styles.icon}>
                <RiInformationFill />
              </span>
            </InfoTooltip>
          </div>
          <p className={styles.values}>{totalVolume}</p>
        </div>

        <div className={styles.selectors}>
          <div className={styles.mainMenu}>
            {optionMap.map((option) => (
              <button
                key={option.value}
                onClick={() => handleActive(option)}
                className={
                  option.value === timeFrame ? styles.button : styles.inactive
                }
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className={styles.mobileMenu}>
            <Dropdown
              instanceId={101}
              options={optionMap}
              update={(e) => handleActive(e)}
              placeholder={optionMap[0].label}
            />
          </div>
        </div>
      </div>

      <div className={styles.responsive}>
        <ResponsiveContainer>
          <AreaChart data={allData}>
            <defs>
              <linearGradient id="wrapperL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ED1EFF" stopOpacity={1} />
                <stop offset="95%" stopColor="#0b0b22" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="debtL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#31D8A4" stopOpacity={1} />
                <stop offset="95%" stopColor="#0b0b22" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="loanL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fff" stopOpacity={1} />
                <stop offset="95%" stopColor="#0b0b22" stopOpacity={0.1} />
              </linearGradient>

              <filter id="shadow" height="200%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" />
              </filter>
            </defs>
            <XAxis dataKey="date" fontSize={14} interval={'preserveStartEnd'} />
            <YAxis
              scale={'linear'}
              hide={true}
              interval="preserveStartEnd"
              tickCount={5}
            />

            <Area
              type="linear"
              dataKey="PERPv1_vol"
              fill="url(#loanL)"
              fillOpacity={0.6}
              stackId={2}
              strokeWidth={2}
              stroke="#fff"
            />

            <Area
              type="linear"
              dataKey="atomic_volume"
              fill="url(#wrapperL)"
              fillOpacity={0.6}
              stackId={2}
              strokeWidth={2}
              stroke="#ED1EFF"
            />

            <Area
              type="linear"
              dataKey="PERPv2_vol"
              fill="url(#debtL)"
              fillOpacity={0.6}
              stackId={2}
              strokeWidth={2}
              stroke="#31D8A4"
            />

            <Tooltip content={<CustomToolTip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.bottom}>
        <div className={styles.debtPool}>
          <h5 className={styles.stakingColor}>PERP V2 Volume</h5>
          <p className={styles.debtWrapVal}>{perpV2Volume}</p>
        </div>

        <div className={styles.wrapper}>
          <h5 className={styles.wrapperColor}>atomic volume</h5>
          <p className={styles.debtWrapVal}>{atomicVolume}</p>
        </div>

        <div className={styles.loan}>
          <h5 className={styles.loanColor}>perp v1 volume</h5>
          <p className={styles.debtWrapVal}>{perpV1Volume}</p>
        </div>
      </div>
    </div>
  )
}

export default TotalValueLocked
