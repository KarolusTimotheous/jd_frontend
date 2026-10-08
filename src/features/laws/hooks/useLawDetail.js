import { useEffect, useState } from "react"
import { getJson } from "../api"
export function useLawDetail(activeLaw, isHome, feedUpdatedAt) {
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState("")
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!feedUpdatedAt || isHome || !activeLaw) return
    const abort = new AbortController()
    setLoadingDetail(true)
    setDetailError("")
    setDetail(null)
    getJson(`/api/laws/${encodeURIComponent(activeLaw)}`, abort.signal)
      .then((value) => {
        if (value.law?.id !== activeLaw || !Array.isArray(value.bills))
          throw new Error("Invalid detail")
        if (!abort.signal.aborted) setDetail(value)
      })
      .catch(() => {
        if (!abort.signal.aborted)
          setDetailError(
            "연결 기록을 가져오지 못했어요. 다시 시도하거나 다른 법률을 선택해 주세요.",
          )
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoadingDetail(false)
      })
    return () => abort.abort()
  }, [activeLaw, isHome, retry, feedUpdatedAt])
  return {
    detail,
    loadingDetail,
    detailError,
    retry: () => setRetry((n) => n + 1),
  }
}
