export function readRoute() {
  const [path, query = ""] = window.location.hash.slice(1).split("?")
  const params = new URLSearchParams(query)
  if (path === "/explore")
    return { view: "explore", id: params.get("node") || "issue" }
  if (path === "/issue")
    return { view: "issue", id: params.get("bill") || "b1" }
  if (path?.startsWith("/lawmakers/"))
    return { view: "notebook", id: path.split("/")[2] }
  return { view: "home" }
}
export function routeHash(route) {
  if (route.view === "explore")
    return `#/explore?node=${encodeURIComponent(route.id || "issue")}`
  if (route.view === "issue")
    return `#/issue?bill=${encodeURIComponent(route.id || "b1")}`
  if (route.view === "notebook")
    return `#/lawmakers/${encodeURIComponent(route.id || "l1")}`
  return "#/today"
}
