import { NODES, TYPE_LABEL, ISSUE_TITLE } from "./data"
import { Badge, Glyph, Label } from "./ui"
import { SourceButton } from "./DetailsDialog"
const byId = (id) => NODES.find((n) => n.id === id)
const kids = (id) => NODES.filter((n) => n.parent === id)
const CX = 480
const CY = 315
function pos(id) {
  if (id === "issue") return { x: CX, y: CY, a: 0 }
  const n = byId(id)
  if (n.parent === "issue") {
    const i = kids("issue").findIndex((k) => k.id === id)
    const a = ((-90 + i * 72) * Math.PI) / 180
    return { x: CX + Math.cos(a) * 235, y: CY + Math.sin(a) * 155, a }
  }
  const p = pos(n.parent)
  const sib = kids(n.parent)
  const i = sib.findIndex((k) => k.id === id)
  const spread = sib.length > 1 ? (i - (sib.length - 1) / 2) * 0.85 : 0
  const a = p.a + spread
  return { x: p.x + Math.cos(a) * 140, y: p.y + Math.sin(a) * 120, a }
}
function wrap(s) {
  if (s.length <= 11) return [s]
  const cut = s.lastIndexOf(" ", 12)
  const at = cut > 4 ? cut : 11
  const rest = s.slice(at).trim()
  return [
    s.slice(0, at).trim(),
    rest.length > 12 ? rest.slice(0, 11) + "…" : rest,
  ]
}
function Detail({ node, onNotebook, expanded, toggle }) {
  const c = kids(node.id)
  return (
    <div className="fade-up" key={node.id}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[11px] border border-ink px-1.5 py-px">
          {TYPE_LABEL[node.type]}
        </span>
        {node.status && <Badge status={node.status} />}
      </div>
      <h3 className="font-serif font-bold text-2xl leading-tight">
        {node.title}
      </h3>
      <p className="text-xs text-mute mt-1">{node.sub}</p>

      <Label className="block mt-6 mb-1.5">① 한 문장 설명</Label>
      <p className="text-[16px] leading-7 bg-pale/70 border-l-2 border-brand px-4 py-3">
        {node.one}
      </p>

      <Label className="block mt-6 mb-1.5">② 핵심 정보</Label>
      <dl className="divide-y divide-rule border-y border-rule text-sm">
        {node.info.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[88px_1fr] gap-3 py-2">
            <dt className="text-mute">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      {node.diffs && (
        <>
          <Label className="block mt-6 mb-1.5">③ 다른 안과의 차이</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-rule bg-white">
              <thead>
                <tr className="bg-paper text-left text-xs text-mute">
                  <th className="p-2 font-medium">항목</th>
                  <th className="p-2 font-medium text-brand">이 항목</th>
                  <th className="p-2 font-medium">다른 안</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {node.diffs.map(([a, b, d]) => (
                  <tr key={a}>
                    <td className="p-2 text-mute whitespace-nowrap">{a}</td>
                    <td className="p-2 font-medium bg-pale/50">{b}</td>
                    <td className="p-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Label className="block mt-6 mb-1.5">
        {node.diffs ? "④" : "③"} 근거와 출처
      </Label>
      <ul className="space-y-1.5 text-sm">
        {node.sources.map((s) => (
          <li key={s.label}>
            <SourceButton
              details={{
                title: s.label,
                org: s.org,
                date: s.date,
                summary: node.one,
                lines: node.info.map(([k, v]) => `${k}: ${v}`),
              }}
              className="font-medium"
            >
              {s.label} 안내
            </SourceButton>
            <span className="text-mute ml-2 text-xs">
              {s.org} · {s.date}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {node.type === "lawmaker" && (
          <button
            onClick={() => onNotebook(node.id)}
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2.5 rounded-sm transition-colors"
          >
            업무노트 보기 →
          </button>
        )}
        {c.length > 0 && (
          <button
            onClick={() => toggle(node.id)}
            className="border border-ink text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-ink hover:text-white transition-colors"
          >
            {expanded.has(node.id)
              ? "연결 접기 −"
              : `연결 ${c.length}건 펼치기 +`}
          </button>
        )}
      </div>
    </div>
  )
}
function MobileTree({ id, depth, sel, setSel, expanded, toggle, onNotebook }) {
  const n = byId(id)
  const open = sel === id
  const c = kids(id)
  const showKids = expanded.has(id)
  return (
    <li className={depth ? "ml-5 border-l border-brand/40 pl-3" : ""}>
      <div
        className={`bg-white border ${open ? "border-brand" : "border-rule"}`}
      >
        <button
          onClick={() => setSel(open ? "" : id)}
          aria-expanded={open}
          className="w-full flex items-center gap-3 p-3 text-left"
        >
          <svg
            width="44"
            height="44"
            viewBox="-50 -50 100 100"
            className="shrink-0"
            aria-hidden
          >
            <Glyph type={n.type} state={open ? "selected" : "idle"} />
          </svg>
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] text-mute">
              {TYPE_LABEL[n.type]}
            </span>
            <span className="block font-medium leading-snug">{n.title}</span>
          </span>
          <span
            className={`text-brand transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>
        {open && (
          <div className="px-4 pb-5 border-t border-rule pt-4">
            <Detail
              node={n}
              onNotebook={onNotebook}
              expanded={expanded}
              toggle={toggle}
            />
          </div>
        )}
      </div>
      {showKids && c.length > 0 && (
        <ul className="mt-2 space-y-2">
          {c.map((k) => (
            <MobileTree
              key={k.id}
              id={k.id}
              depth={depth + 1}
              sel={sel}
              setSel={setSel}
              expanded={expanded}
              toggle={toggle}
              onNotebook={onNotebook}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
export default function Explore({
  sel,
  setSel,
  expanded,
  setExpanded,
  onNotebook,
  onHome,
  onIssue,
}) {
  const toggle = (id) => {
    const s = new Set(expanded)
    if (s.has(id)) {
      s.delete(id)
      let selectedNode = NODES.find((node) => node.id === sel)
      while (selectedNode?.parent) {
        if (selectedNode.parent === id) {
          setSel(id)
          break
        }
        selectedNode = NODES.find((node) => node.id === selectedNode.parent)
      }
    } else s.add(id)
    setExpanded(s)
  }
  const visible = NODES.filter((n) => {
    let cur = n
    while (cur && cur.parent) {
      if (!expanded.has(cur.parent)) return false
      cur = byId(cur.parent)
    }
    return true
  })
  const vis = new Set(visible.map((n) => n.id))
  const selected = byId(sel || "issue") || byId("issue")
  const linked = new Set([selected.id])
  if (selected.parent) linked.add(selected.parent)
  kids(selected.id).forEach((k) => linked.add(k.id))
  const hiddenCount = NODES.length - visible.length
  const select = (id) => {
    setSel(id)
    if (kids(id).length && !expanded.has(id)) toggle(id)
  }
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-8 fade-up">
      <div className="mb-6">
        <Label>02 · 국회탐험</Label>
        <h1 className="font-serif font-black text-2xl md:text-4xl mt-1 max-w-[24ch] leading-tight">
          {ISSUE_TITLE}
        </h1>
        <p className="text-sm text-mute mt-2 max-w-[60ch]">
          이슈를 중심으로 직접 연결된 항목만 먼저 보여드립니다. 항목을 선택하면
          연결이 한 단계씩 펼쳐집니다.
        </p>
      </div>

      <div className="hidden lg:grid grid-cols-[1.45fr_1fr] gap-8 items-start">
        <div className="bg-white border border-rule sticky top-28">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2.5 border-b border-rule text-xs">
            {["issue", "bill", "lawmaker", "budget", "audit"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="22" height="22" viewBox="-50 -50 100 100">
                  <Glyph type={t} />
                </svg>
                {t === "issue"
                  ? "원 · 이슈"
                  : t === "bill"
                    ? "문서 · 법안"
                    : t === "lawmaker"
                      ? "초상 · 의원"
                      : t === "budget"
                        ? "육각 ₩ · 예산"
                        : "마름모 돋보기 · 국감"}
              </span>
            ))}
          </div>
          <svg
            viewBox="0 0 960 650"
            className="w-full h-auto"
            role="group"
            aria-label="이슈 관계도"
          >
            <defs>
              <pattern
                id="dots"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#e3e1da" />
              </pattern>
            </defs>
            <rect width="960" height="650" fill="url(#dots)" />
            {visible
              .filter((n) => n.parent)
              .map((n) => {
                const a = pos(n.parent)
                const b = pos(n.id)
                const on = linked.has(n.id) && linked.has(n.parent)
                return (
                  <line
                    key={n.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={on ? "#6250D8" : "#b9b7ae"}
                    strokeWidth={on ? 2.5 : 1.3}
                    strokeDasharray={n.status === "제안" ? "6 5" : undefined}
                    className="transition-all"
                  />
                )
              })}
            {visible.map((n) => {
              const p = pos(n.id)
              const state =
                n.id === selected.id
                  ? "selected"
                  : linked.has(n.id)
                    ? "linked"
                    : "idle"
              const c = kids(n.id)
              const lines = wrap(n.title)
              const off = n.type === "issue" ? 62 : 48
              return (
                <g
                  key={n.id}
                  transform={`translate(${p.x} ${p.y})`}
                  className="pop"
                >
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${TYPE_LABEL[n.type]}: ${n.title}`}
                    aria-pressed={state === "selected"}
                    onClick={() => select(n.id)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      (e.preventDefault(), select(n.id))
                    }
                    className="cursor-pointer outline-none focus-visible:opacity-80 hover:opacity-90"
                  >
                    <rect
                      x="-52"
                      y="-52"
                      width="104"
                      height="104"
                      fill="transparent"
                    />
                    <Glyph type={n.type} state={state} />
                    {c.length > 0 && !expanded.has(n.id) && (
                      <g transform="translate(30 -30)">
                        <circle
                          r="10"
                          fill="#fff"
                          stroke="#6250D8"
                          strokeWidth="1.6"
                        />
                        <text
                          y="4"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="700"
                          fill="#6250D8"
                          fontFamily="JetBrains Mono"
                        >
                          +{c.length}
                        </text>
                      </g>
                    )}
                    <text
                      y={off}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#626774"
                      fontFamily="JetBrains Mono"
                      style={{ paintOrder: "stroke" }}
                      stroke="#fff"
                      strokeWidth="4"
                    >
                      {TYPE_LABEL[n.type]}
                      {n.status ? ` · ${n.status}` : ""}
                    </text>
                    {lines.map((l, i) => (
                      <text
                        key={i}
                        y={off + 14 + i * 14}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight={state === "idle" ? 500 : 700}
                        fill={state === "idle" ? "#20222A" : "#4a3bb5"}
                        fontFamily="Noto Sans KR"
                        style={{ paintOrder: "stroke" }}
                        stroke="#fff"
                        strokeWidth="4"
                      >
                        {l}
                      </text>
                    ))}
                  </g>
                </g>
              )
            })}
          </svg>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-rule text-xs text-mute">
            <span>
              <span className="inline-block w-6 border-t-2 border-dashed border-mute align-middle mr-1" />{" "}
              점선 = 제안 단계 ·{" "}
              <span className="inline-block w-6 border-t-2 border-brand align-middle mr-1" />{" "}
              선택 항목과 연결
            </span>
            <span>
              {hiddenCount > 0
                ? `숨은 연결 ${hiddenCount}건`
                : "모든 연결 표시 중"}
              {expanded.size > 0 && (
                <button
                  onClick={() => {
                    setExpanded(new Set(["issue"]))
                    setSel("issue")
                  }}
                  className="ml-3 text-brand font-medium underline underline-offset-2"
                >
                  처음 상태로
                </button>
              )}
            </span>
          </div>
        </div>

        <aside className="bg-white border border-rule p-6 border-t-2 border-t-ink min-h-[560px]">
          <Detail
            node={selected}
            onNotebook={onNotebook}
            expanded={expanded}
            toggle={toggle}
          />
        </aside>
      </div>

      <ul className="lg:hidden space-y-2">
        <MobileTree
          id="issue"
          depth={0}
          sel={sel}
          setSel={(id) => {
            setSel(id)
          }}
          expanded={expanded}
          toggle={toggle}
          onNotebook={onNotebook}
        />
      </ul>

      <div className="mt-6">
        <button
          onClick={() => onIssue(selected.type === "bill" ? selected.id : "b1")}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-3 text-sm"
        >
          관련 영상·법안·질문 함께 보기
        </button>
      </div>
      <button
        onClick={onHome}
        className="mt-10 text-sm text-brand font-medium underline underline-offset-4"
      >
        ← 오늘의 국회에서 보던 이슈로 돌아가기
      </button>
      <span className="sr-only">{vis.size}</span>
    </div>
  )
}
