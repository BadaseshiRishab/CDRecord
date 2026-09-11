import { useCallback, useEffect, useState } from 'react'
import { fetchCallRecords } from '../lib/api'

/**
 * Fetches CDR records on mount and exposes a `refresh` function to re-fetch
 * on demand (e.g. from a "Refresh" button in the header).
 */
export function useCallRecords() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    fetchCallRecords()
      .then((records) => {
        if (cancelled) return
        setData(records)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error('Failed to load call records'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setReloadToken((token) => token + 1)
    }, 15000)

    return () => clearInterval(intervalId)
  }, [])

  const refresh = useCallback(() => setReloadToken((token) => token + 1), [])

  return { data, loading, error, refresh }
}
