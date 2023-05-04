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

    const { debt, loan, date } = payload[0].payload
  
    return (
      <div className={styles.TTwrap}>
        <h6 className={styles.TTheading}>{date}</h6>
        <h6 className={styles.TTheading}>SNX Staked</h6>
        <p className={styles.TTdebt}>{debt ? formatMoney.format(debt) : 0}</p>
        <h6 className={styles.TTheading}>SNX Loan</h6>
        <p className={styles.TTdebt}>{loan ? formatMoney.format(loan) : 0}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip