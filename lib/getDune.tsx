import { useState, useEffect } from 'react'

const query = async (url: string, method = 'GET', body = null) => {
  const meta = {
    'x-dune-api-key': '',
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

export const fetchExecutionResult = async (id: string, queryId: string) => {
  const localResult = JSON.parse(localStorage.getItem(queryId) || '{}')
  const { execution_state } = localResult
  if (execution_state !== 'QUERY_STATE_COMPLETED') {
    const timer = setInterval(() => {}, 1000)
  } else {
    const res = await query(
      `https://api.dune.com/api/v1/execution/${id}/results`
    )

    const latestResult = res.result.rows[0]
    const resultRows = res.result.rows

    return {
      latestResult,
      resultRows,
    }
  }
  // get status from localStorage
  // if status is COMPLETE then query the result
  // else return the a promise function
  //      resolve value until status is COMPLETE
  //
}

export const fetchExecutionId = async (queryId: string): Promise<string> => {
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
      return fetchExecutionId(queryId)
    }
  } else {
    const executionIdRes = await query(
      `https://api.dune.com/api/v1/query/${queryId}/execute`,
      'POST'
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

export const fetchDune = async () => {
  // 1895265 Synthetix Unique Stakers
  // 1898719 SNX Staking Ration

  // const executionIdRes = await query(
  //   'https://api.dune.com/api/v1/query/1895265/execute',
  //   'POST'
  // )

  //   const executionId = executionIdRes.execution_id
  //   console.log(executionId);

  // TODO: write an interval that may not get execution_id every time

  const res = await query(
    `https://api.dune.com/api/v1/execution/01GTDGTF60QBKRHPC0EZQCJM45/results`
  )

  const latestResult = res.result.rows[0]
  const resultRows = res.result.rows

  return {
    latestResult,
    resultRows,
  }
}

export const fetchStakersDune = async () => {
  const res = await query(
    `https://api.dune.com/api/v1/execution/01GTDGTF60QBKRHPC0EZQCJM45/results`
  )

  const latestResult = res.result.rows[0]
  const resultRows = res.result.rows

  return {
    latestResult,
    resultRows,
  }
}

export const fetchFees = async () => {
  const queryId = '1893390'
  const execution_id = await fetchExecutionId(queryId)
  const resutl = await fetchExecutionResult(execution_id, queryId)
  console.log('Fee', execution_id)
}

export const fetchSNXInflation = async () => {
  //   const executionIdRes = await query(
  //     'https://api.dune.com/api/v1/query/1906342/execute',
  //     'POST'
  //   )

  const res = await query(
    `https://api.dune.com/api/v1/execution/01GTJJ93HHQM93B6V7GNV4NB9V/results`
  )

  const latestResult = res.result.rows[0]
  const resultRows = res.result.rows

  return {
    latestResult,
    resultRows,
  }
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

export function useDuneFetch(queryId: string) {
  const [resultRows, setResultRows] = useState(null)
  const [latestResult, setLatestResult] = useState(null)

  useEffect(() => {
    fetchExecutionId(queryId)
      .then((executionId) => {
        const id = setInterval(() => {
          fetchStatus(executionId, id)
        }, 1000)
      })
      .catch((err) => console.log(err))
  }, [])

  const fetchStatus = async (executionId: string, id) => {
    const state = await getStatus(queryId, executionId)
    console.log('fetchStatus', state)

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

const convertDate = (date) =>
  (new Date(date)).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })

// handle SNX divide by weekly or daily
export function divide(rows) {
  if (!rows || rows.length === 0) {
    return {}
  }
  // date stakers
  // sort by day
  const sorted = rows.sort(function (a, b) {
    return new Date(b.day) - new Date(a.day)
  })
  // dailyOVM
  const dailyOVM = sorted
    .slice(0, 7)
    .reduce((res, val, idx) => {
      const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } = val
      res.push({
        date: convertDate(day),
        stakers: cumulative_evt,
      })

      return res
    }, [])
    .reverse()
  // weekly OVM
  const weeklyOVM = sorted
    .reduce((res, val, idx) => {
      if ((idx + 1) % 7 === 0) {
        const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } =
          val
        res.push({
          date: convertDate(day),
          stakers: cumulative_evt,
        })
      }
      return res
    }, [])
    .slice(0, 7).reverse()
  //   monthly OVM
  const monthlyOVM = sorted
    .reduce((res, val, idx) => {
      if ((idx + 1) % 30 === 0) {
        const { day, cumulative_L1_evt, cumulative_L2_evt, cumulative_evt } =
          val
        res.push({
          date: convertDate(day),
          stakers: cumulative_evt,
        })
      }
      return res
    }, [])
    .slice(0, 7).reverse()

  return {
    dailyOVM,
    weeklyOVM,
    monthlyOVM,
  }
}

export function divideInflation(rows) {
  if (!rows || rows.length === 0) {
    return {}
  }
  const sortedRows = rows.sort(function (a, b) {
    return new Date(b.day) - new Date(a.day)
  })

  const inflationDataAll = []
  const inflationDataMain = []
  const inflationDataOvm = []
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
