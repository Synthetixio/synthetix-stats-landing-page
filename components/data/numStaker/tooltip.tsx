import { TooltipProps } from 'recharts';
import { formatNumber } from '../../../constants/format';
import styles from './Tooltip.module.css'

// date
// tvl
// SNX Staked
// wrapper
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {


    


  if (active) {

    
    const numStakerTT = payload && payload[0].value

    return (
      <div className={styles.TTwrap}>
        <p className={styles.TTlabel}>{label}</p>
        <p className={styles.TTnumStake}>{numStakerTT ? formatNumber.format(numStakerTT) : 0}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip