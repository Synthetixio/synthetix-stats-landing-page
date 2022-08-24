import { formatPercent } from "../constants/format";
import { getFeePeriods, getLatestRateById, getSNXHolders, getSynthetixById } from "../subgraphs/subgraph-ovm";

// staking, apy, inflation

export const staker = async () => {
    const mainnet_url = "https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main"
    const optimism_url = "https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main"
    const OP_URL = "https://api-optimistic.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4&apikey=XKERESFNFECWPVYT3NXK48N24N77NVKK7Z"
    const snx_API = "https://api.synthetix.io/staking-ratio"
    const MAIN_URL = "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F&apikey=4YCUHXX2TCJPD6IFYSSI7DCX62QUZCSIUC"
    const dataStore = {}
    
    const snxRateCall = await getLatestRateById(
        optimism_url,
        { id: "SNX" },
        { rate: true }
    );

    const snxRate = snxRateCall.rate.toNumber()

    const dataFetchSNX = await fetch(snx_API)
    const dataFetchOP = await fetch(OP_URL)
    const dataFetchMain = await fetch(MAIN_URL)

    const mainData = await dataFetchMain.json()
    const opData = await dataFetchOP.json()
    const snxData = await dataFetchSNX.json() 

    const totalSupplyOvm = opData.result / 1e18
    const totalSupplyMain = mainData.result / 1e18

    const totalStakeOvm = snxData.stakedSnx.optimism
    const totalStakeMain = snxData.stakedSnx.ethereum
    const totalStakeAll = totalStakeMain + totalStakeOvm

    const stakeValueOvm = totalStakeOvm * snxRate
    const stakeValueMain = totalStakeMain * snxRate
    const stakeValueAll = totalStakeAll * snxRate





    const percentStakedMain = totalStakeMain / totalSupplyMain
    const percentStakedOvm = totalStakeOvm / totalSupplyOvm
    const percentStakedAll = snxData.systemStakingPercent






    //const APYcalc = (fee / (snxRate * totalCollateral) * 52 + (reward / totalCollateral) * 52)

    //inflation

    const snxFeePeriods = async (network: string) => {
        const currentFeePeriods = await getFeePeriods(
            network,
            { orderBy: "startTime", orderDirection: "desc", first: 1000 },
            {
                feesClaimed: true,
                feesToDistribute: true,
                startTime: true,
                rewardsClaimed: true,
                rewardsToDistribute: true,
            }
        );

        const reward = currentFeePeriods[0].rewardsToDistribute.toNumber();

        const rewardsAmount = currentFeePeriods.reduce((sum: number, current) => {
            return sum + current.rewardsToDistribute.toNumber();
        }, 0);



        const inflationData = currentFeePeriods.slice(0, 7).map((item) => {
            const milli = new Date(item.startTime.toNumber() * 1000)
            const month = milli.getUTCMonth() + 1
            const day = milli.getUTCDate()
            const theDate = `${month}/${day}`

            return { 
                snx_rewards: item.rewardsToDistribute.toNumber(),
                date: theDate
            };
        }).reverse();

   

        // APY
        const fee = currentFeePeriods[0].feesToDistribute.toNumber();


        return {
            reward,
            rewardsAmount,
            inflationData,
            fee
        }

    }


    const ovmFeePeriod = await snxFeePeriods(optimism_url)
    const mainFeePeriod = await snxFeePeriods(mainnet_url)

    const rewardOvm = ovmFeePeriod.reward
    const rewardMain = mainFeePeriod.reward
    const rewardAll = rewardMain + rewardOvm

    const rewardsAmountOvm = ovmFeePeriod.rewardsAmount
    const rewardsAmountMain = mainFeePeriod.rewardsAmount
    const rewardsAmountAll = rewardsAmountMain + rewardsAmountOvm

    const inflationDataOvm = ovmFeePeriod.inflationData
    const inflationDataMain = mainFeePeriod.inflationData


    const inflationDataAllArr:any[] = [...inflationDataMain, ...inflationDataOvm]

    const inflationDataAll = inflationDataAllArr.reduce((acc:any,cur)=>{
        const {snx_rewards, date} = cur
        const item = acc.find((it: { date: string; }) => it.date === date)
        if (item){
            item.snx_rewards += snx_rewards
        }
        else {
            acc.push({snx_rewards,date})
        }
        return acc
    },[])


    const feeOvm = ovmFeePeriod.fee
    const feeMain = mainFeePeriod.fee


    // Inflation

    const apyOvm = ((feeOvm / (snxRate * totalStakeOvm)) + (rewardOvm/ totalStakeOvm)) * 52

    const apyMain = ((feeMain / (snxRate * totalStakeMain)) + (rewardMain / totalStakeMain)) * 52
    const apyAvg = (apyMain + apyOvm) / 2




    return {
        percentStakedMain,
        percentStakedOvm,
        percentStakedAll,
        totalStakeAll,
        totalStakeOvm,
        totalStakeMain,
        stakeValueAll,
        stakeValueMain,
        stakeValueOvm,
        apyOvm,
        apyMain,
        apyAvg,
        rewardMain,
        rewardOvm,
        rewardAll,
        rewardsAmountMain,
        rewardsAmountOvm,
        rewardsAmountAll,
        inflationDataMain,
        inflationDataOvm,
        inflationDataAll

    }

}



