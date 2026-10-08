import { test } from "node:test"
import assert from "node:assert/strict"
import { liveHash, readLiveRoute } from "../src/app/routes.js"
test("existing bookmarked explorer and notebook URLs survive the directory refactor", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "location")
  try {
    for (const route of [
      { view: "today" },
      { view: "explore", law: "20230007", node: "people" },
      { view: "notebook", law: "20230007", person: "22nd:HANZEEA" },
    ]) {
      Object.defineProperty(globalThis, "location", {
        configurable: true,
        value: { hash: liveHash(route) },
      })
      assert.deepEqual(JSON.parse(JSON.stringify(readLiveRoute())), route)
    }
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { hash: "#/lawmakers/%E0%A4%A?law=20230007" },
    })
    assert.equal(readLiveRoute().person, undefined)
  } finally {
    if (original) Object.defineProperty(globalThis, "location", original)
    else Reflect.deleteProperty(globalThis, "location")
  }
})
