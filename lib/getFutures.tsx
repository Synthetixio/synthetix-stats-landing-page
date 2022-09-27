import { wei } from "@synthetixio/wei";
import { formatPercentDec } from "../constants/format";
import { getFuturesCumulativeStats, getFuturesOneMinStats, getFuturesTrades } from "../subgraphs/subgraph-kwenta";
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

  const fetchKwenta = async (timeStamp: number) => {
    const tradeDataCall = await getFuturesOneMinStats(
      kwenta_url,
      { first: 999999, where: { timestamp_gt: timeStamp } },
      { id: true, trades: true, volume: true }
    );

    const futureDataCall = await getTotals(
      optimism_url,
      { orderBy: "timestamp", orderDirection: "desc", where: { timestamp_gt: timeStamp, product: "futures" } },
      { exchangeUSDTally: true, trades: true, totalFeesGeneratedInUSD: true, product: true }
    );

    const yo = tradeDataCall.reduce((sum, cur) => {
      return {
        trades: cur.trades.toNumber() + sum.trades,
        volume: sum.volume.add(cur.volume.div(ETH_UNIT).abs()),
      }
    }, {
      trades: 0,
      volume: wei(0),
    })

    const totalFee = futureDataCall.reduce((sum, cur) => {
      return {
        fees: sum.fees + cur.totalFeesGeneratedInUSD.toNumber()
      }
    }, {
      fees: 0
    })



    return {
      yo,
      totalFee
    }
  }




  const kwentaDaily = await fetchKwenta(times.twentyFourHourAgo)
  const kwentaSeven = await fetchKwenta(times.sevenDayAgo)
  const kwentaThirty = await fetchKwenta(times.thirtyDayAgo)
  const kwentaNinety = await fetchKwenta(times.ninetyDayAgo)
  const kwentaAll = await fetchKwenta(1646101538) // futures launch date




  return {
    kwentaAll,
    kwentaDaily,
    kwentaSeven,
    kwentaThirty,
    kwentaNinety
  };
};


