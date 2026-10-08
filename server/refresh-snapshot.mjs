import { getFeed, getLaw } from "./argos.mjs"
import { mkdir, writeFile } from "node:fs/promises"
await mkdir("data", { recursive: true })
const feed = await getFeed()
if (feed.mode === "stale")
  throw new Error("Cannot publish a new snapshot from stale data")
await writeFile("data/feed.json", JSON.stringify(feed, null, 2))
for (const law of feed.items) {
  const detail = await getLaw(law.id)
  await writeFile(`data/law-${law.id}.json`, JSON.stringify(detail, null, 2))
  console.log(
    `${law.rank}. ${law.name}: ${detail.bills.length} bills, ${detail.people.length} lawmakers, ${detail.warnings.length} warnings`,
  )
}
