import { TooltipProps } from 'recharts'
import { formatMoney } from '../../../constants/format'
import styles from './Tooltip.module.css'
import { DisplayRow } from '../../../lib/helper/convertFees'

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
    const { l1fee, l2fee, combined } =
      payload[0].payload as DisplayRow

    return (
      <div className={styles.TTwrap}>
        <p className={styles.TTlabel}>{label}</p>
        <h6 className={styles.TTheading}>Combined Fee</h6>
        <p className={styles.TTtvl}>{formatMoney.format(combined)}</p>
        <h6 className={styles.TTheading}>L2 Fee</h6>
        <p className={styles.TTdebt}>
          {l2fee ? formatMoney.format(l2fee) : 0}
        </p>
        <h6 className={styles.TTheading}>L1 Fee</h6>
        <p className={styles.TTloans}>
          {l1fee ? formatMoney.format(l1fee) : 0}
        </p>
      </div>
    )
  }

  return null
}

export default CustomTooltip
