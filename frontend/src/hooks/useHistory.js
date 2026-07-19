import { useCallback, useEffect, useState } from 'react'
import { fetchHistory, deleteHistoryItem } from '../services/api'

export default function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchHistory()
      setHistory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = useCallback(async (id) => {
    const previous = history
    setHistory((h) => h.filter((entry) => entry.id !== id))
    try {
      await deleteHistoryItem(id)
    } catch (err) {
      setHistory(previous)
      setError(err.message)
    }
  }, [history])

  return { history, loading, error, reload: load, remove }
}
