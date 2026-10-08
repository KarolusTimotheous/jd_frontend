import { useCallback, useEffect, useRef, useState } from "react"
import { getJson } from "../api"
export function useLawFeed() {
  const [feed, setFeed] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const controller = useRef(null)
  const refresh = useCallback(async () => {
    controller.current?.abort()
    const abort = new AbortController()
    controller.current = abort
    setRefreshing(true)
    setError("")
    try {
      const value = await getJson("/api/laws", abort.signal)
      if (!Array.isArray(value.items) || value.items.length !== 20)
        throw new Error("법률 목록 형식이 변경됐습니다.")
      setFeed(value)
    } catch {
      if (!abort.signal.aborted)
        setError("법률 목록을 불러오지 못했어요. 다시 시도해 주세요.")
    } finally {
      if (!abort.signal.aborted) setRefreshing(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
    return () => controller.current?.abort()
  }, [refresh])
  return { feed, refreshing, error, refresh }
}
