import { wei } from "@synthetixio/wei";
import { formatPercentDec } from "../constants/format";
import { getFuturesCumulativeStats, getFuturesOneMinStats } from "../subgraphs/subgraph-kwenta";
import { getTotals } from "../subgraphs/subgraph-ovm";
import getTime from "./getTime";

// return kwenta vol for each timeframe from this lib, and import into tradeData lib. 
// or, in tradeData lib, if optimism, run this function 

const ETH_UNIT = 1000000000000000000;


export const getFutures = async () => {

  const { times } = getTime()

  const mainnet_url = "https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main"
  const optimism_url = "https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main"
  const kwenta_url = "https://api.thegraph.com/subgraphs/name/kwenta/optimism-main"

  const fetchKwenta = async (network: string, timeStamp: number) => {
    const tradeDataCall = await getFuturesOneMinStats(
      network,
      { first:999999, where:{timestamp_gt:timeStamp}},
      { id:true, trades:true, volume:true }
    );

    const yo = tradeDataCall.reduce((sum,cur)=>{
      return {
            trades: cur.trades.toNumber() + sum.trades,
            volume: sum.volume.add(cur.volume.div(ETH_UNIT).abs()),
          }
    },{
        trades: 0,
        volume: wei(0),
    })


    return {
     yo
    }
  }


  const kwentaDaily = await fetchKwenta(kwenta_url, times.twentyFourHourAgo)
  const kwentaSeven = await fetchKwenta(kwenta_url, times.sevenDayAgo)
  const kwentaThirty = await fetchKwenta(kwenta_url, times.thirtyDayAgo)
  const kwentaNinety = await fetchKwenta(kwenta_url, times.ninetyDayAgo)
  const kwentaAll = await fetchKwenta(kwenta_url, 1646101538) // futures launch date

  console.log(kwentaAll)
  console.log(kwentaDaily.yo.volume.toNumber())


  



  return {
    kwentaAll,
    kwentaDaily,
    kwentaSeven,
    kwentaThirty,
    kwentaNinety
  };
};


