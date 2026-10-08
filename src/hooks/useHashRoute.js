import { useEffect, useState } from "react"
import { liveHash, readLiveRoute } from "../app/routes"
export function useHashRoute() {
  const [route, setRoute] = useState(readLiveRoute)
  useEffect(() => {
    const change = () => {
      setRoute(readLiveRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", change)
    window.addEventListener("popstate", change)
    return () => {
      window.removeEventListener("hashchange", change)
      window.removeEventListener("popstate", change)
    }
  }, [])
  useEffect(() => {
    document.title = `${
      route.view === "today"
        ? "오늘의 국회"
        : route.view === "explore"
          ? "국회탐험"
          : "의원의 업무노트"
    } | 정독`
  }, [route.view])
  function navigate(next, scroll = true, replace = false) {
    history[replace ? "replaceState" : "pushState"](null, "", liveHash(next))
    setRoute(next)
    if (scroll) {
      window.scrollTo({ top: 0, behavior: "instant" })
      requestAnimationFrame(() =>
        document.getElementById("main-content")?.focus({ preventScroll: true }),
      )
    }
  }
  return { route, navigate }
}
