import { load } from "cheerio/slim"
import { readFile, writeFile, mkdir, rename } from "node:fs/promises"
import { resolve } from "node:path"

export const ARGOS = "https://argos.nanet.go.kr"
export const ASSEMBLY = "https://likms.assembly.go.kr"
export const SOURCE = `${ARGOS}/main/fusionanalysis/lawIssueGuest.do`
const root = process.env.JEONGDOK_DATA_DIR || process.cwd()
const memo = new Map()
const pending = new Map()
const clean = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
const safeUrl = (value) => {
  try {
    const u = new URL(value)
    return u.protocol === "https:" ? u.href : ""
  } catch {
    return ""
  }
}
const stamp = () => new Date().toISOString()
const billUrl = (id) =>
  `${ASSEMBLY}/bill/billDetail.do?billId=${encodeURIComponent(id)}`

async function request(url, body, form = false) {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: body
      ? {
          "Content-Type": form
            ? "application/x-www-form-urlencoded"
            : "application/json; charset=utf-8",
        }
      : {},
    body: body
      ? form
        ? new URLSearchParams(body).toString()
        : JSON.stringify(body)
      : undefined,
    signal: AbortSignal.timeout(18000),
  })
  if (!response.ok) throw new Error(`Source HTTP ${response.status}`)
  return response
}
async function json(path, body) {
  const data = await (await request(ARGOS + path, body)).json()
  if (data.result !== "success" || !Array.isArray(data.list))
    throw new Error("Source format changed")
  return data
}
async function disk(name) {
  for (const folder of [".runtime", "data"]) {
    try {
      return JSON.parse(
        await readFile(resolve(root, folder, `${name}.json`), "utf8"),
      )
    } catch {
      /* next fallback */
    }
  }
  return null
}
async function remember(name, data) {
  memo.set(name, data)
  try {
    await mkdir(resolve(root, ".runtime"), { recursive: true })
    const path = resolve(root, ".runtime", `${name}.json`)
    await writeFile(path + ".tmp", JSON.stringify(data), "utf8")
    await rename(path + ".tmp", path)
  } catch {
    /* Read-only deployments can keep a memory cache. */
  }
  return data
}
async function cached(name, loader, ttl = 0) {
  if (pending.has(name)) return pending.get(name)
  const task = (async () => {
    const old = memo.get(name) || (await disk(name))
    if (old && ttl && Date.now() - Date.parse(old.fetchedAt) < ttl)
      return { ...old, mode: "cached" }
    try {
      return {
        ...(await remember(name, { ...(await loader()), fetchedAt: stamp() })),
        mode: "live",
      }
    } catch (error) {
      console.warn(`[Jeongdok] ${name}: ${error.message}`)
      if (old)
        return {
          ...old,
          mode: "stale",
          warning: "원본 연결이 지연되어 마지막으로 확인한 기록을 보여드려요.",
        }
      throw error
    }
  })()
  pending.set(name, task)
  try {
    return await task
  } finally {
    pending.delete(name)
  }
}

export function normalizeFeed(data) {
  if (!Array.isArray(data.list) || data.list.length < 20)
    throw new Error("Expected the first 20 laws")
  const items = data.list.slice(0, 20).map((r, index) => ({
    id: clean(r.LAW_KWD_ID),
    parentId: clean(r.LAW_KWD_PID),
    rank: index + 1,
    name: clean(r.LAW_KWD),
    issue: clean(r.ISS_KWD_DISP),
    summary: clean(r.SUMMARY),
    updated: clean(r.GTR_YMD).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"),
    sourceUrl:
      SOURCE +
      "?" +
      new URLSearchParams({
        lawKwdId: r.LAW_KWD_ID,
        lawKwdPid: r.LAW_KWD_PID,
        titleNm: r.LAW_KWD,
      }),
  }))
  if (
    items.some((r) => !/^\d{8}$/.test(r.id) || !r.name) ||
    new Set(items.map((r) => r.id)).size !== 20
  )
    throw new Error("Invalid source laws")
  return {
    items,
    sourceUrl: SOURCE,
    order: "업데이트순",
    total: Number(data.list[0].TOTAL_CNT) || null,
  }
}
export function getFeed() {
  return cached("feed", async () =>
    normalizeFeed(
      await json("/api/lawIssue/searchLawIssList.do", {
        searchYn: "Y",
        searchKeyword: "",
        cmtList: "",
        currentPage: 1,
        orderType: "gtr",
        lastIndex: 20,
        firstIndex: 1,
        startCode: "",
        endCode: "",
      }),
    ),
  )
}

export function parseBillPage(html, id) {
  const $ = load(html)
  if ($("#billId").val() !== id || !$(".detailh3").length)
    throw new Error("Bill page format changed")
  const fields = {}
  $(".law_meta_table strong").each((_, el) => {
    fields[clean($(el).text())] = clean($(el).next("div").text())
  })
  const params = {}
  $("#form input[name]").each((_, el) => {
    params[$(el).attr("name")] = $(el).val() || ""
  })
  const people = []
  $(".meta_man").each((_, el) => {
    const url = safeUrl($(el).attr("href"))
    const name = clean($(el).find("img").attr("alt")).replace(/\s*의원$/, "")
    if (!url.startsWith("https://www.assembly.go.kr/members/") || !name) return
    const personId = new URL(url).pathname
      .replace(/\/$/, "")
      .split("/")
      .slice(-2)
      .join(":")
    if (!people.some((p) => p.id === personId))
      people.push({
        id: personId,
        name,
        profileUrl: url,
        image: safeUrl($(el).find("img").attr("src")),
        role: "대표발의",
      })
  })
  return {
    id,
    number: clean($("#billNo").val()),
    title: clean($(".detailh3").text()).replace(/^\[\d+\]\s*/, ""),
    proposed: fields["제안일자"] || "",
    decided: fields["의결일자"] || "",
    result: fields["의결결과"] || "",
    committee: fields["소관위원회"] || "",
    promulgated: clean($("#announceDt").val()),
    people,
    sourceUrl: billUrl(id),
    params,
    hasAlternatives: $('[data-tabnm="anBillInfo"]').length > 0,
  }
}
export function parseAlternatives(html, mainId) {
  const $ = load(html)
  return [
    ...new Set(
      $('input[name="anBillDwnList"][data-bill-id]')
        .map((_, el) => $(el).attr("data-bill-id"))
        .get(),
    ),
  ].filter((id) => id !== mainId && /^[A-Za-z0-9_]+$/.test(id))
}
async function officialBill(id) {
  return cached(
    `bill-${id}`,
    async () => {
      const page = parseBillPage(await (await request(billUrl(id))).text(), id)
      let text = ""
      try {
        const $ = load(
          await (
            await request(
              `${ASSEMBLY}/bill/bi/popup/billSummary.do?billId=${encodeURIComponent(id)}`,
            )
          ).text(),
        )
        text = $(".print_pre").text().trim()
      } catch {
        /* Source links remain available if the summary is unavailable. */
      }
      return { ...page, text }
    },
    15 * 60 * 1000,
  )
}
async function mapLimit(items, fn, limit = 3) {
  let cursor = 0
  const results = new Array(items.length)
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}
export async function getLaw(id) {
  if (!/^\d{8}$/.test(id)) throw new Error("Invalid law id")
  const currentFeed = memo.get("feed") || (await disk("feed"))
  const current = currentFeed?.items.find((r) => r.id === id)
  const previous = memo.get(`law-${id}`) || (await disk(`law-${id}`))
  const changed =
    current &&
    previous &&
    (current.updated !== previous.law.updated ||
      current.summary !== previous.law.summary)
  return cached(
    `law-${id}`,
    async () => {
      const feed = memo.get("feed") || (await disk("feed")) || (await getFeed())
      const law = feed.items.find((r) => r.id === id)
      if (!law) throw new Error("Law is not in this feed")
      const data = await json("/api/lawIssue/getLawIssList.do", {
        law_kwd_id: id,
        law_kwd_pid: law.parentId,
      })
      const rows = data.list.filter((r) => r.LAW_KWD_ID === id)
      const meta =
        rows.find((r) => r.PART === "ISSUE")?.SUMMARY?.split("|") || []
      const kinds = {
        ISS: "이슈",
        BILL: "의안",
        MEET: "회의록",
        MODI: "개정",
        MAKE: "제정",
        PROD: "공포",
        ACT: "시행",
        NEWS: "보도",
        APOS: "세미나",
      }
      const timeline = rows
        .filter((r) => kinds[r.PART])
        .map((r, i) => ({
          id: `${r.PART}-${i}`,
          kind: kinds[r.PART],
          date: clean(r.YMD).replaceAll(".", "-"),
          title: clean(r.SUMMARY),
          count: Number(r.CNT) || 1,
          url: safeUrl(r.LNK_URL),
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
      const month = rows.find((r) => r.PART === "BILL")?.YM
      const warnings = []
      let records = [],
        bills = [],
        alternativeTotal = 0
      if (month) {
        try {
          const result = await json(
            "/main/fusionanalysis/getLawIssPopList.do",
            { part: "BILL", lawKwdId: id, currentPage: 1, billDt: month },
          )
          records = result.list.map((r) => ({
            number: clean(r.BILL_NO),
            title: clean(r.BILL_NM),
            proposer: clean(r.USER_NM),
            status: clean(r.STATUS),
            date: clean(r.ACT_DT).replaceAll("/", "-"),
            url: safeUrl(r.LNK_URL),
          }))
          const record = records.find((r) =>
            r.url.startsWith(`${ASSEMBLY}/bill/`),
          )
          const billId =
            record && new URL(record.url).searchParams.get("billId")
          if (billId && /^[A-Za-z0-9_]+$/.test(billId)) {
            const main = await officialBill(billId)
            bills.push({ ...main, relation: "최근 연결 의안" })
            if (main.mode === "stale")
              warnings.push("최근 의안은 마지막 확인본입니다.")
            if (main.hasAlternatives) {
              const html = await (
                await request(
                  `${ASSEMBLY}/bill/bi/bill/detail/anBillInfo.do`,
                  main.params,
                  true,
                )
              ).text()
              const ids = parseAlternatives(html, billId)
              alternativeTotal = ids.length
              const linked = await mapLimit(ids.slice(0, 20), async (other) => {
                try {
                  return {
                    ...(await officialBill(other)),
                    relation: "대안에 연결된 원안",
                  }
                } catch {
                  warnings.push("일부 원안의 상세 정보를 불러오지 못했습니다.")
                  return null
                }
              })
              bills.push(...linked.filter(Boolean))
            }
          }
        } catch (error) {
          warnings.push(
            "의안·발의 의원 연결을 모두 확인하지 못했습니다. 원문에서 확인해 주세요.",
          )
        }
      }
      const people = []
      for (const bill of bills)
        for (const person of bill.people) {
          let existing = people.find((p) => p.id === person.id)
          if (!existing) {
            existing = { ...person, billIds: [] }
            people.push(existing)
          }
          existing.billIds.push(bill.id)
        }
      return {
        law,
        fullName: clean(meta[0]) || law.name,
        enacted: clean(meta[6]).replaceAll(".", "-"),
        timeline,
        records,
        bills: bills.map(({ params, ...b }) => b),
        people,
        alternativeTotal,
        scope:
          "아르고스가 최근 연결한 의안 1건과 그 대안에 연결된 원안(최대 20건)",
        warnings: [...new Set(warnings)],
      }
    },
    changed ? 0 : 15 * 60 * 1000,
  )
}

export async function handleApi(req, res) {
  const url = new URL(req.url, "http://localhost")
  if (!url.pathname.startsWith("/api/")) return false
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("X-Content-Type-Options", "nosniff")
  if (req.method !== "GET") {
    res.writeHead(405)
    res.end(JSON.stringify({ error: "GET only" }))
    return true
  }
  try {
    let data
    if (url.pathname === "/api/laws") data = await getFeed()
    else if (/^\/api\/laws\/\d{8}$/.test(url.pathname))
      data = await getLaw(url.pathname.split("/").pop())
    else {
      res.writeHead(404)
      res.end(JSON.stringify({ error: "Unknown resource" }))
      return true
    }
    res.end(JSON.stringify(data))
  } catch {
    res.writeHead(502)
    res.end(
      JSON.stringify({
        error: "공개 자료를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      }),
    )
  }
  return true
}
