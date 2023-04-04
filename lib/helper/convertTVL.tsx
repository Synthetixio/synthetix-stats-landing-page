import { divideTVL } from '../getDune'

export default function convertTVL(resultRows, onChain) {
  const result = divideTVL(resultRows)

  const {
    dayMain,
    dayOvm,
    weekMain,
    weekOvm,
    monthMain,
    monthOvm,
    dayAll,
    weekAll,
    monthAll,
  } = result

  dayMain.forEach((v, idx) => {
    v.loan = onChain.mainDailyLoans[idx]
    v.wrapper = onChain.mainDailyWrapper[idx]
  })
  dayOvm.forEach((v, idx) => {
    v.loan = onChain.ovmDailyLoans[idx]
    v.wrapper = onChain.ovmDailyWrapper[idx]
  })
  dayAll?.forEach((v, idx) => {
    v.loan = onChain.mainDailyLoans[idx] + onChain.ovmDailyLoans[idx]
    v.wrapper = onChain.mainDailyLoans[idx] + onChain.ovmDailyLoans[idx]
  })

  weekMain.forEach((v, idx) => {
    v.loan = onChain.mainnetWeeklyLoans[idx]
    v.wrapper = onChain.mainnetWeeklyWrapper[idx]
  })
  weekOvm?.forEach((v, idx) => {
    v.loan = onChain.ovmWeeklyLoans[idx]
    v.wrapper = onChain.ovmWeeklyWrapper[idx]
  })
  weekAll?.forEach((v, idx) => {
    v.loan = onChain.mainnetWeeklyLoans[idx] + onChain.ovmWeeklyLoans[idx]
    v.wrapper = onChain.mainnetWeeklyLoans[idx] + onChain.ovmWeeklyLoans[idx]
  })

  monthMain.forEach((v, idx) => {
    v.loan = onChain.mainnetMonthlyLoans[idx]
    v.wrapper = onChain.mainnetMonthlyWrapper[idx]
  })
  monthOvm?.forEach((v, idx) => {
    v.loan = onChain.ovmMonthlyLoans[idx]
    v.wrapper = onChain.ovmMonthlyWrapper[idx]
  })
  monthAll?.forEach((v, idx) => {
    v.loan = onChain.mainnetMonthlyLoans[idx] + onChain.ovmMonthlyLoans[idx]
    v.wrapper = onChain.mainnetMonthlyLoans[idx] + onChain.ovmMonthlyLoans[idx]
  })

  return result
}
