import styles from "./numStaker.module.css";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";
import { formatNumber } from "../../../constants/format";
import CustomToolTip from './tooltip'
import InfoTooltip from "../../infoToolTip/InfoTooltip";
import { RiInformationFill } from "react-icons/ri"
import Dropdown from '../../dropdown/Dropdown'






interface NumStaker {
  currentStakerAll: number;
  currentStakerOvm: number;
  currentStakerMain: number;
  dayAll: any[];
  dayMain: any[];
  dayOvm: any[];
  weekAll: any[];
  weekMain: any[];
  weekOvm: any[];
  monthAll: any[];
  monthMain: any[];
  monthOvm: any[];
  click: number;
  totalAll: any[];
  totalMain: any[];
  totalOvm: any[];
}
const NumStaker = ({
  click,
  currentStakerAll,
  currentStakerOvm,
  currentStakerMain,
  dayAll,
  dayMain,
  dayOvm,
  weekAll,
  weekMain,
  weekOvm,
  monthAll,
  monthMain,
  monthOvm,
  totalOvm,
  totalMain,
  totalAll,
}: NumStaker) => {

  const allStaker = formatNumber.format(currentStakerAll)
  const ovmStaker = formatNumber.format(currentStakerOvm)
  const mainStaker = formatNumber.format(currentStakerMain)

  const optionMap = [
    { value: 1, label: "Daily" },
    { value: 2, label: "Weekly" },
    { value: 3, label: "Monthly" },
    { value: 4, label: "All Time"}
  ]


  const [timeFrame, setTimeFrame] = useState(1);

  const handleActive = (option: any) => {
    setTimeFrame(option.value);
  };

  const getData = () => {
    if (timeFrame === 1) {
      return [dayOvm, dayMain, dayAll]
    } 
    if (timeFrame === 2) {
      return [weekOvm, weekMain, weekAll]
    }
    if (timeFrame === 3) {
      return [monthOvm, monthMain, monthAll]
    }
    if (timeFrame === 4) {
      return [totalOvm, totalMain, totalAll]
    }
    throw new Error(`Invalid timeFrame value: ${timeFrame}`)
  }

  const [ovmData, mainData, allData] = getData()

  const ttInfo = `How many SNX is currently staked. Updated every 15 minutes`


  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.numStakerTitle}>Number of Stakers</h3>
            <InfoTooltip content={ttInfo}>

              <span
                className={styles.icon}
              >
                <RiInformationFill />
              </span>
            </InfoTooltip>
          </div>
          <p className={styles.value}>{click === 1 ? mainStaker : click === 10 ? ovmStaker : allStaker}</p>
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

            <Dropdown instanceId={25} options={optionMap} update={(e) => handleActive(e)} placeholder={optionMap[0].label} />

          </div>

        </div>
      </div>

      <ResponsiveContainer height={200} width="100%">
        <AreaChart data={click === 1 ? mainData : click === 10 ? ovmData : allData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#402FC8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#402FC8" stopOpacity={0.1} />

            </linearGradient>

           
        <filter id="shadow" height="200%">
            <feDropShadow dx="3" dy="10" stdDeviation="10" color="#8884d8"/>
        </filter>
  

          </defs>


          <Area
            type="linear"
            dataKey="stakers"
            stroke="#8884d8"
            strokeWidth={2}
            fill="url(#colorUv)"
            fillOpacity={0.4}
            style={{
              filter: `drop-shadow(0px 0px 15px #402FC8`
            }}
          />
          <Tooltip content={<CustomToolTip />} />
          <YAxis domain={["auto", "auto"]} hide={true} />
          <XAxis dataKey={"date"} interval={"preserveStartEnd"} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NumStaker;
