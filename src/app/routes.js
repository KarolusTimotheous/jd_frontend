export function readLiveRoute() {
  const [path, query = ""] = location.hash.slice(1).split("?")
  const params = new URLSearchParams(query)
  let person
  try {
    person = path?.startsWith("/lawmakers/")
      ? decodeURIComponent(path.slice(11))
      : undefined
  } catch {
    /* invalid bookmark */
  }
  return {
    view: path?.startsWith("/lawmakers")
      ? "notebook"
      : path === "/explore"
        ? "explore"
        : "today",
    law: params.get("law") || undefined,
    node: params.get("node") || undefined,
    person,
  }
}
export function liveHash(route) {
  const path =
    route.view === "today"
      ? "/today"
      : route.view === "explore"
        ? "/explore"
        : "/lawmakers" +
          (route.person ? "/" + encodeURIComponent(route.person) : "")
  const query = new URLSearchParams()
  if (route.law) query.set("law", route.law)
  if (route.node) query.set("node", route.node)
  return "#" + path + (query.size ? "?" + query : "")
}
