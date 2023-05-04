import { useState, useEffect } from 'react'

const query = async (
  url: string,
  method = 'GET',
  body: string | null = null
) => {
  const meta = {
    'x-dune-api-key': process.env.DUNE_API_KEY as string,
  }
  const header = new Headers(meta)

  let result = null

  try {
    const response = await fetch(url, { method, headers: header, body })
    result = await response.json()
  } catch (error) {
    console.log(error)
  }

  return result
}

export const fetchExecutionId = async (
  queryId: string,
  body?: string
): Promise<string> => {
  const queryIdData = localStorage.getItem(queryId)
  let result = null

  if (queryIdData) {
    const jsonQueryIdData = JSON.parse(queryIdData)
    const { executionTs, executionId } = jsonQueryIdData

    if (Date.now() - executionTs <= 24 * 60 * 60 * 1000) {
      result = executionId
    } else {
      console.log('[DBG] time is running out')
      localStorage.removeItem(queryId)
      return fetchExecutionId(queryId, body)
    }
  } else {
    const executionIdRes = await query(
      `https://api.dune.com/api/v1/query/${queryId}/execute`,
      'POST',
      body
    )

    const executionId = executionIdRes.execution_id
    localStorage.setItem(
      queryId,
      JSON.stringify({
        executionId: executionId,
        executionTs: Date.now(),
        executionState: executionIdRes.state,
      })
    )
    result = executionId
  }

  return result
}

const getStatus = async (queryId: string, executionId: string) => {
  const localResult = localStorage.getItem(queryId) || '{}'
  const { executionState } = JSON.parse(localResult)
  const state = executionState
  if (state === 'QUERY_STATE_COMPLETED') {
    return state
  } else {
    const result = await query(
      `https://api.dune.com/api/v1/execution/${executionId}/status`
    )
    const { state } = result
    localStorage.setItem(
      queryId,
      JSON.stringify({
        ...JSON.parse(localResult),
        executionState: state,
      })
    )
    return state
  }
}

export function useDuneFetch(queryId: string, body?: string) {
  const [resultRows, setResultRows] = useState(null)
  const [latestResult, setLatestResult] = useState(null)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    fetchExecutionId(queryId, body)
      .then((executionId) => {
        const id = setInterval(() => {
          fetchStatus(executionId, id)
        }, 10000)
      })
      .catch((err) => console.log(err))
  }, [])

  const fetchStatus = async (executionId: string, id: NodeJS.Timer) => {
    const state = await getStatus(queryId, executionId)
    setCounter(counter + 1)
    if (counter >= 3) {
      clearInterval(id)
      console.log('[ERROR] status')
    }

    if (state === 'QUERY_STATE_COMPLETED') {
      clearInterval(id)
      fetchExecutionResult(executionId)
    }
  }

  const fetchExecutionResult = async (executionId: string) => {
    const res = await query(
      `https://api.dune.com/api/v1/execution/${executionId}/results`
    )

    const latestResult = res.result.rows[0]
    const resultRows = res.result.rows
    setResultRows(resultRows)
    setLatestResult(latestResult)
  }

  return {
    latestResult,
    resultRows,
  }
}

const convertDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  })

interface StakerRow {
  date: string
  stakers: number
}
// handle SNX divide by weekly or daily
type SNXRow = {
  day: string
  cumulative_evt: number
  cumulative_L1_evt: number
  cumulative_L2_evt: number
}
export function divide(rows: SNXRow[]) {
  if (!rows || rows.length === 0) {
    return {}
  }
  const sorted = rows.sort(sort)

  // dailyOVM
  const dayAll: StakerRow[] = []
  const dayMain: StakerRow[] = []
  const dayOvm: StakerRow[] = []

  const weekAll: StakerRow[] = []
  const weekMain: StakerRow[] = []
  const weekOvm: StakerRow[] = []

  const monthAll: StakerRow[] = []
  const monthMain: StakerRow[] = []
  const monthOvm: StakerRow[] = []

  const totalAll: StakerRow[] = []
  const totalMain: StakerRow[] = []
  const totalOvm: StakerRow[] = []

  sorted.slice(0, 7).forEach((row: SNXRow) => {
    const { day, cumulative_evt, cumulative_L1_evt, cumulative_L2_evt } = row
    const date = convertDate(day)
    dayAll.unshift({
      date,
      stakers: cumulative_evt,
    })
    dayMain.unshift({
      date,
      stakers: cumulative_L1_evt,
    })
    dayOvm.unshift({
      date,
      stakers: cumulative_L2_evt,
    })
  })

  sorted.slice(0, 7 * 8).forEach((row, idx) => {
      const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } = row
      const date = convertDate(day)
      weekAll.unshift({
        date,
        stakers: cumulative_evt,
      })
      weekMain.unshift({
        date,
        stakers: cumulative_L1_evt,
      })
      weekOvm.unshift({
        date,
        stakers: cumulative_L2_evt,
      })
  })

  //   monthly OVM
  sorted.slice(0, 30 * 8).forEach((row, idx: number) => {
      const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } = row
      const date = convertDate(day)
      monthAll.unshift({
        date,
        stakers: cumulative_evt,
      })
      monthMain.unshift({
        date,
        stakers: cumulative_L1_evt,
      })
      monthOvm.unshift({
        date,
        stakers: cumulative_L2_evt,
      })
  })

  sorted.forEach(row => {
      const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } = row
      const date = convertDate(day)
      totalAll.unshift({
        date,
        stakers: cumulative_evt,
      })
      totalMain.unshift({
        date,
        stakers: cumulative_L1_evt,
      })
      totalOvm.unshift({
        date,
        stakers: cumulative_L2_evt,
      })
  })

  return {
    dayAll,
    dayMain,
    dayOvm,

    weekAll,
    weekMain,
    weekOvm,

    monthAll,
    monthMain,
    monthOvm,
    
    totalAll,
    totalMain,
    totalOvm,
  }
}

interface Row {
  date: string
  snx_rewards: number
}
interface DataSourceRow {
  week: string
  SNX_totalSupply: number
  L1_totalSupply: number
  L2_totalSupply: number
}

export function divideInflation(rows: DataSourceRow[]) {
  if (!rows || rows.length === 0) {
    return {}
  }
  const sortedRows = rows.sort(sort)

  const inflationDataAll: Row[] = []
  const inflationDataMain: Row[] = []
  const inflationDataOvm: Row[] = []
  sortedRows.slice(0, 7).forEach((row) => {
    const { week, SNX_totalSupply, L1_totalSupply, L2_totalSupply } = row
    const date = convertDate(week)
    inflationDataAll.push({
      date,
      snx_rewards: SNX_totalSupply,
    })
    inflationDataMain.push({
      date,
      snx_rewards: L1_totalSupply,
    })
    inflationDataOvm.push({
      date,
      snx_rewards: L2_totalSupply,
    })
  })

  return {
    inflationDataAll: inflationDataAll.reverse(),
    inflationDataMain: inflationDataMain.reverse(),
    inflationDataOvm: inflationDataOvm.reverse(),
  }
}

const sort = (a: object, b: object) => {
  // @ts-ignore
  const aDate = new Date(a.day || a.week)
  // @ts-ignore
  const bDate = new Date(b.day || b.week)

  if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
    throw new Error(`Invalid date format ${a} ${b}`)
  }

  return bDate.getTime() - aDate.getTime()
}

export interface TVLQueryRow {
  day: string
  SDS_L2: number
  SDS_L1: number
  SDS_price: number
  cratio: number
  L1_stake_debt: number
  L2_stake_debt: number
  total_stake_debt: number
  TVL_L1_Staked: number
  TVL_L2_Staked: number
  TVL_staked: number
  L1_mCap: number
  L2_mCap: number
  total_mCap: number
  SNX_price: number
  L1_stake_ratio: number
  L2_stake_ratio: number
  Total_stake_ratio: number
}

export interface TVLRow {
  date: string
  debt: number
  wrapper: number
  loan: number
}

export interface TVLData {
  dayAll: TVLRow[]
  dayMain: TVLRow[]
  dayOvm: TVLRow[]
  weekAll: TVLRow[]
  weekMain: TVLRow[]
  weekOvm: TVLRow[]
  monthAll: TVLRow[]
  monthMain: TVLRow[]
  monthOvm: TVLRow[]
  totalOvm: TVLRow[]
  totalMain: TVLRow[]
  totalAll: TVLRow[]
}

export function divideTVL(rows: TVLQueryRow[]): TVLData | object {
  if (!rows || rows.length === 0) {
    return {}
  }

  const sorted = rows.sort(sort)

  const dayAll: TVLRow[] = []
  const dayMain: TVLRow[] = []
  const dayOvm: TVLRow[] = []

  const weekAll: TVLRow[] = []
  const weekMain: TVLRow[] = []
  const weekOvm: TVLRow[] = []

  const monthAll: TVLRow[] = []
  const monthMain: TVLRow[] = []
  const monthOvm: TVLRow[] = []

  const totalAll: TVLRow[] = []
  const totalMain: TVLRow[] = []
  const totalOvm: TVLRow[] = []

  sorted.slice(0, 7).forEach((row: TVLQueryRow) => {
    const {
      day,
      TVL_L1_Staked,
      TVL_L2_Staked,
      TVL_staked,
      L1_stake_debt,
      L2_stake_debt,
    } = row
    const date = convertDate(day)
    dayAll.unshift({
      date,
      debt: TVL_staked,
      wrapper: 0,
      loan: L1_stake_debt + L2_stake_debt,
    })
    dayMain.unshift({
      date,
      debt: TVL_L1_Staked,
      wrapper: 0,
      loan: L1_stake_debt,
    })
    dayOvm.unshift({
      date,
      debt: TVL_L2_Staked,
      wrapper: 0,
      loan: L2_stake_debt,
    })
  })

  sorted.slice(0, 7 * 7).forEach((row) => {
      const {
        day,
        TVL_L1_Staked,
        TVL_L2_Staked,
        TVL_staked,
        L1_stake_debt,
        L2_stake_debt,
      } = row
      const date = convertDate(day)
      weekAll.unshift({
        date,
        debt: TVL_staked,
        wrapper: 0,
        loan: L1_stake_debt + L2_stake_debt,
      })
      weekMain.unshift({
        date,
        debt: TVL_L1_Staked,
        wrapper: 0,
        loan: L1_stake_debt,
      })
      weekOvm.unshift({
        date,
        debt: TVL_L2_Staked,
        wrapper: 0,
        loan: L2_stake_debt,
      })
  })

  //   monthly OVM
  sorted.slice(0, 30 * 7).forEach((row) => {
      const {
        day,
        TVL_L1_Staked,
        TVL_L2_Staked,
        TVL_staked,
        L1_stake_debt,
        L2_stake_debt,
      } = row
      const date = convertDate(day)
      monthAll.unshift({
        date,
        debt: TVL_staked,
        wrapper: 0,
        loan: L1_stake_debt + L2_stake_debt,
      })
      monthMain.unshift({
        date,
        debt: TVL_L1_Staked,
        wrapper: 0,
        loan: L1_stake_debt,
      })
      monthOvm.unshift({
        date,
        debt: TVL_L2_Staked,
        wrapper: 0,
        loan: L2_stake_debt,
      })
  })

  // total Data
  sorted.forEach((row) => {
    const {
      day,
      TVL_L1_Staked,
      TVL_L2_Staked,
      TVL_staked,
      L1_stake_debt,
      L2_stake_debt,
    } = row
    const date = convertDate(day)
    totalAll.unshift({
      date,
      debt: TVL_staked,
      wrapper: 0,
      loan: L1_stake_debt + L2_stake_debt,
    })
    totalMain.unshift({
      date,
      debt: TVL_L1_Staked,
      wrapper: 0,
      loan: L1_stake_debt,
    })
    totalOvm.unshift({
      date,
      debt: TVL_L2_Staked,
      wrapper: 0,
      loan: L2_stake_debt,
    })
  })

  return {
    dayOvm,
    dayMain,
    dayAll,
    weekOvm,
    weekMain,
    weekAll,
    monthOvm,
    monthMain,
    monthAll,
    totalOvm,
    totalMain,
    totalAll,
  }
}
