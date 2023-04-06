import { TooltipProps } from 'recharts';
import { formatMoney } from '../../../constants/format';
import styles from './Tooltip.module.css'

// date
// tvl
// SNX Staked
// wrapper
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {

  if (active && payload && payload.length) {

    const debtVal = payload[0].value
  
    return (
      <div className={styles.TTwrap}>
        <h6 className={styles.TTheading}>SNX Staked</h6>
        <p className={styles.TTdebt}>{debtVal ? formatMoney.format(debtVal) : 0}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip