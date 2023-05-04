import { TooltipProps } from 'recharts'
import { formatMoney } from '../../../constants/format'
import styles from './Tooltip.module.css'
import { DisplayRow } from '../../../lib/helper/convertVolumes'

// date
// tvl
// SNX Staked
// wrapper

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {

  if (active && payload) {
    const { PERP, atomic_volume, total_volume } =
      payload[0].payload as DisplayRow

    return (
      <div className={styles.TTwrap}>
        <p className={styles.TTlabel}>{label}</p>
        <h6 className={styles.TTheading}>TOTAL Volume</h6>
        <p className={styles.TTtvl}>{formatMoney.format(total_volume)}</p>
        <h6 className={styles.TTheading}>PERP Volume</h6>
        <p className={styles.TTdebt}>
          {PERP ? formatMoney.format(PERP) : 0}
        </p>
        <h6 className={styles.TTheading}>ATOMIC VOLUME</h6>
        <p className={styles.TTwrapper}>
          {atomic_volume ? formatMoney.format(atomic_volume) : 0}
        </p>
      </div>
    )
  }

  return null
}

export default CustomTooltip
