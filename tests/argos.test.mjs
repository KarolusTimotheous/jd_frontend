import { test } from "node:test"

import assert from "node:assert/strict"

import { readFile, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"

import { tmpdir } from "node:os"

import { join } from "node:path"

import {
  normalizeFeed,
  parseBillPage,
  parseAlternatives,
} from "../server/argos.mjs"

test("preserves Argos order; rejects incomplete or duplicate top-20 results", async () => {
  const feed = JSON.parse(await readFile("data/feed.json", "utf8"))

  const list = feed.items.map((l, i) => ({
    LAW_KWD_ID: l.id,
    LAW_KWD: l.name,
    LAW_KWD_PID: l.parentId,
    GTR_YMD: l.updated.replaceAll("-", ""),
    ISS_KWD_DISP: l.issue,
    SUMMARY: l.summary,
    RNUM: i + 1,
  }))

  assert.deepEqual(
    normalizeFeed({ list }).items.map((l) => l.id),
    feed.items.map((l) => l.id),
  )

  assert.throws(() => normalizeFeed({ list: list.slice(0, 19) }))

  assert.throws(() => normalizeFeed({ list: [...list.slice(0, 19), list[0]] }))

  assert.equal(normalizeFeed({ list: [...list, list[0]] }).items.length, 20)
})

test("committee proposers are never converted to personal lawmaker profiles", () => {
  const html =
    '<input id="billId" value="committee"><h3 class="detailh3">[123] 위원회 대안</h3><a class="meta_comm"><img alt="보건복지위원장"></a>'

  assert.deepEqual(parseBillPage(html, "committee").people, [])

  assert.throws(() => parseBillPage("<h1>접속 오류</h1>", "committee"))
})

test("official profile identity survives name formatting and ignores unsafe links", () => {
  const html =
    '<input id="billId" value="original"><h3 class="detailh3">[234] 원안</h3><a class="meta_man" href="https://www.assembly.go.kr/members/22nd/HANZEEA"><img alt="한지아 의원" src="https://www.assembly.go.kr/photo.png"></a><a class="meta_man" href="javascript:alert(1)"><img alt="다른 의원"></a>'

  const people = parseBillPage(html, "original").people

  assert.equal(people.length, 1)
  assert.equal(people[0].id, "22nd:HANZEEA")
  assert.equal(people[0].name, "한지아")
  assert.equal(people[0].role, "대표발의")

  assert.deepEqual(
    parseAlternatives(
      '<input name="anBillDwnList" data-bill-id="original"><input name="anBillDwnList" data-bill-id="original"><input name="anBillDwnList" data-bill-id="main">',
      "main",
    ),
    ["original"],
  )
})

test("all 20 captured laws retain source links and scoped person-to-bill relationships", async () => {
  const feed = JSON.parse(await readFile("data/feed.json", "utf8"))

  for (const law of feed.items) {
    const d = JSON.parse(await readFile(`data/law-${law.id}.json`, "utf8"))

    assert.equal(d.law.id, law.id)
    assert.ok(d.timeline.length)

    for (const p of d.people) {
      assert.ok(p.profileUrl.startsWith("https://www.assembly.go.kr/members/"))

      for (const id of p.billIds)
        assert.ok(
          d.bills.some(
            (b) => b.id === id && b.people.some((bp) => bp.id === p.id),
          ),
        )
    }
  }
})

test("source outage returns dated last-confirmed data, never a fabricated live feed", async () => {
  const dir = await mkdtemp(join(tmpdir(), "jeongdok-test-"))

  const originalFetch = globalThis.fetch

  try {
    await mkdir(join(dir, "data"))

    const captured = JSON.parse(await readFile("data/feed.json", "utf8"))

    await writeFile(join(dir, "data/feed.json"), JSON.stringify(captured))

    process.env.JEONGDOK_DATA_DIR = dir

    globalThis.fetch = async () => {
      throw new Error("test: source unavailable")
    }

    const isolated = await import("../server/argos.mjs?isolated-test=1")

    const result = await isolated.getFeed()

    assert.equal(result.mode, "stale")
    assert.equal(result.fetchedAt, captured.fetchedAt)

    assert.equal(result.items.length, 20)
    assert.ok(result.warning)
  } finally {
    globalThis.fetch = originalFetch
    delete process.env.JEONGDOK_DATA_DIR
    await rm(dir, { recursive: true, force: true })
  }
})
