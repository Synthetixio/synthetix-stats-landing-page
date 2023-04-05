import { TooltipProps } from 'recharts'
import { formatMoney } from '../../../constants/format'
import styles from './Tooltip.module.css'
import { DisplayRow } from '../../../lib/helper/convertVolumes'

// date
// tvl
// staking debt pool
// wrapper

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {

  if (active && payload) {
    const { PERPv1_vol, PERPv2_vol, atomic_volume, total_volume } =
      payload[0].payload as DisplayRow

    return (
      <div className={styles.TTwrap}>
        <p className={styles.TTlabel}>{label}</p>
        <h6 className={styles.TTheading}>TOTAL Volume</h6>
        <p className={styles.TTtvl}>{formatMoney.format(total_volume)}</p>
        <h6 className={styles.TTheading}>PERP V2</h6>
        <p className={styles.TTdebt}>
          {PERPv2_vol ? formatMoney.format(PERPv2_vol) : 0}
        </p>
        <h6 className={styles.TTheading}>PERP V1</h6>
        <p className={styles.TTloans}>
          {PERPv1_vol ? formatMoney.format(PERPv1_vol) : 0}
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
