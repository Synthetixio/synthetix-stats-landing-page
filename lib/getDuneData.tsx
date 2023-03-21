import NodeCache from "node-cache"

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
  const executionIdRes = await query(
    `https://api.dune.com/api/v1/query/${queryId}/execute`,
    'POST',
    body
  )

  return executionIdRes.execution_id
}

function createFetchWithRetry(queryId: string, cache: NodeCache, body?: string) {
  return async function () {
    const cachedResult = cache.get(queryId)

    if (cachedResult) {
      console.log(`Using Cached Data for ${queryId}`)
      return cachedResult
    }
    const executionId = await fetchExecutionId(queryId, body)

    console.log(queryId, executionId);
    
    async function checkStatusAndRetry() {
      const statusRes = await query(
        `https://api.dune.com/api/v1/execution/${executionId}/status`
      )
      const { state: status } = statusRes

      if (status === 'QUERY_STATE_COMPLETED') {
        const resultsRes = await query(
          `https://api.dune.com/api/v1/execution/${executionId}/results`
        )
        const {
          result: { rows },
        } = resultsRes
        cache.set(queryId, { latestResult: rows[0], resultRows: rows })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        await checkStatusAndRetry()
      }
    }

    await checkStatusAndRetry()

    return cache.get(queryId)
  }
}

export { createFetchWithRetry }
