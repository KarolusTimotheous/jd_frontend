import { useState } from "react"
import { LAWMAKERS, NODES } from "./data"
import { Badge, Initial, Label, SectionHead } from "./ui"
import { LawmakerQuestions } from "./Conversation"
import { SourceButton } from "./DetailsDialog"
const TL = [
  {
    date: "2026.10.07",
    kind: "발의",
    title: "주거안정 기금 320억 원 증액 수정안 제출",
    body: "A안 시행을 전제로 예결위에 수정안을 냈습니다. 논의는 아직 시작되지 않았습니다.",
    status: "제안",
    src: "예산결산특별위원회",
  },
  {
    date: "2026.10.06",
    kind: "기관 응답",
    title: "보증기관, 반환 지연 사례 자료 제출 약속",
    body: "평균 94일 지연, 서류 보완이 주된 사유라고 답변. 10월 20일까지 제출 예정입니다.",
    status: "확정",
    src: "국정감사 회의록",
  },
  {
    date: "2026.10.06",
    kind: "질의",
    title: "보증금 반환 지연 사유 질의",
    body: "지연 기간과 사유를 공개하라고 요구하고 사례별 자료를 요청했습니다.",
    status: "확정",
    src: "국정감사 회의록",
  },
  {
    date: "2026.09.18",
    kind: "발의",
    title: "전세사기피해자법 개정안(A) 대표발의",
    body: "보증금 상한을 5억에서 7억 원으로 높이는 안. 현재 법안소위에 회부된 상태입니다.",
    status: "제안",
    src: "의안정보시스템",
  },
  {
    date: "2026.07.14",
    kind: "표결",
    title: "주택도시기금법 일부개정안 찬성",
    body: "본회의 재석 262명 중 찬성 231명으로 가결되었습니다.",
    status: "확정",
    src: "본회의 표결 기록",
  },
  {
    date: "2026.06.02",
    kind: "기관 응답",
    title: "국토부, 임대차 정보 공개 방안 회신",
    body: "질의서에 대해 ‘선순위 보증금 열람 시스템’ 검토 계획을 서면 회신했습니다.",
    status: "확정",
    src: "서면질의 답변서",
  },
]
const AREAS = [
  {
    name: "주거",
    n: 9,
    items: [
      "전세사기피해자법 개정안(A) — 제안",
      "주택도시기금법 개정안 찬성 — 확정",
      "국감 질의 2회 — 확정",
    ],
  },
  {
    name: "노동",
    n: 5,
    items: [
      "플랫폼 노동자 산재 적용 법안 공동발의 — 제안",
      "노동위 청문회 질의 1회 — 확정",
    ],
  },
  {
    name: "교육",
    n: 3,
    items: [
      "돌봄교실 예산 심사 의견 — 확정",
      "교육격차 해소 토론회 개최 — 확정",
    ],
  },
]
const YEARS = {
  bill: {
    label: "대표발의 법안",
    unit: "건",
    v: [11, 14, 8],
    note: "대표발의자로 등록된 의안 수 (공동발의 제외)",
  },
  q: {
    label: "상임위·국감 질의",
    unit: "회",
    v: [27, 33, 19],
    note: "회의록에 기록된 발언 중 질의 형식인 건수",
  },
  pass: {
    label: "원안·수정 가결",
    unit: "건",
    v: [3, 5, 2],
    note: "대표발의 법안 중 본회의 가결 건수 (대안 반영 포함)",
  },
}
const YR = ["2024", "2025", "2026*"]
const DISC = {
  경력: [
    "2024.05~ 제22대 국회의원 (재선)",
    "2020.05~2024.05 제21대 국회의원",
    "2016~2020 주거권 시민단체 정책실장",
  ],
  정치후원금: [
    "2025년 모금액 1억 4,200만 원 · 한도 대비 92%",
    "사용 내역: 사무소 운영 41% · 정책개발 33% · 기타 26%",
    "10만 원 이하 소액 후원자 비중 78%",
  ],
  재산신고: [
    "2026년 3월 공개 기준 신고액 11억 3,600만 원",
    "전년 대비 +1억 2,000만 원 (예금 증가분)",
    "공직자윤리위원회 관보 공개 자료",
  ],
}
export default function Notebook({ id, onExplore, onIssue }) {
  const p = LAWMAKERS[id] ?? LAWMAKERS.l1
  const [filter, setFilter] = useState("전체")
  const [openArea, setOpenArea] = useState(0)
  const [metric, setMetric] = useState("bill")
  const [tab, setTab] = useState("경력")
  const node = NODES.find((n) => n.id === id)
  const primary = id === "l1"
  const relatedBill =
    id === "l3"
      ? "주택임대차보호법 개정안(B)"
      : id === "l4"
        ? "긴급주거지원 예산안"
        : "전세사기피해자법 개정안(A)"
  const records = primary
    ? TL
    : [
        {
          date: node.sources[0].date,
          kind: id === "l4" ? "예산 심사" : "발의",
          title:
            id === "l4"
              ? "긴급주거지원 예산 심사 의견"
              : node.sub.split(" · ")[0],
          body: node.one,
          status: "제안",
          src: "의원 활동 기록",
        },
      ]
  const areas = primary
    ? AREAS
    : [
        {
          name: id === "l4" ? "예산" : "주거",
          n: records.length,
          items: [
            relatedBill,
            node.info.find(([key]) => key === "관련 활동")?.[1] ||
              "관련 기록 확인 전",
          ],
        },
      ]
  const m = YEARS[metric]
  const max = Math.max(...m.v) * 1.15
  const list = records.filter((t) => filter === "전체" || t.kind === filter)
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-8 fade-up">
      {/* 프로필 */}
      <section className="grid lg:grid-cols-[360px_1fr] gap-10 pb-10 border-b-2 border-ink">
        <div className="flex gap-5">
          <div className="shrink-0">
            <Initial name={p.name} size={96} />
          </div>
          <div>
            <Label>03 · 의원의 업무노트</Label>
            <h1 className="font-serif font-black text-4xl leading-tight">
              {p.name}
            </h1>
            <p className="text-sm text-mute mt-1">
              {p.party} · {p.district} · {p.term}
            </p>
            <p className="text-sm">{p.committee}</p>
            <span className="inline-block mt-2 text-[11px] border border-dashed border-mute text-mute px-1.5">
              가상 인물 · 디자인 예시
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <Label>최근 집중 이슈</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(primary
                ? ["전세사기 지원", "주거안정 기금", "임대차 정보 공개"]
                : [relatedBill]
              ).map((c) => (
                <span
                  key={c}
                  className="bg-pale text-brand-dark text-sm px-2.5 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
            <button
              onClick={onExplore}
              className="text-sm text-brand font-medium mt-3 underline underline-offset-4"
            >
              이슈 맥락으로 돌아가기 →
            </button>
            <br />
            <button
              onClick={onIssue}
              className="text-sm text-brand font-medium mt-3 underline underline-offset-4"
            >
              관련 법안 읽고 질문하기
            </button>
          </div>
          <div>
            <Label>주요 조치</Label>
            <ul className="mt-2 space-y-2 text-sm">
              {primary ? (
                <>
                  <li>
                    <Badge status="확정" />
                    <br />
                    국감 질의 · 자료 제출 약속 확인
                  </li>
                  <li>
                    <Badge status="제안" />
                    <br />
                    개정안(A) 대표발의 · 수정안 제출
                  </li>
                </>
              ) : (
                <li>
                  <Badge status="제안" />
                  <p className="mt-2 leading-7">{node.one}</p>
                </li>
              )}
            </ul>
          </div>
          <div>
            <Label>후속 확인 필요</Label>
            <ul className="mt-2 space-y-2 text-sm">
              {primary ? (
                <>
                  <li className="border-l-2 border-brand pl-3">
                    <span className="font-mono text-xs text-brand">~10.20</span>
                    <br />
                    보증기관 자료 제출 이행 여부
                  </li>
                  <li className="border-l-2 border-brand pl-3">
                    <span className="font-mono text-xs text-brand">미정</span>
                    <br />
                    법안소위 A안 심사 일정
                  </li>
                </>
              ) : (
                <li className="border-l-2 border-brand pl-3">
                  {relatedBill}의 심사 결과와 후속 활동 확인
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 01 최근 활동 */}
      <section className="mt-12">
        <SectionHead
          no="01"
          title="최근 활동"
          desc="발의 · 질의 · 표결 · 기관 응답을 시간순으로"
        />
        <div className="flex flex-wrap gap-2 mb-6" role="group">
          {[
            "전체",
            "발의",
            "질의",
            "표결",
            "기관 응답",
            ...(id === "l4" ? ["예산 심사"] : []),
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`text-sm px-3 py-1.5 border transition-colors ${
                filter === f
                  ? "bg-brand text-white border-brand"
                  : "border-rule bg-white hover:border-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <ol className="relative border-l-2 border-ink ml-2 space-y-6">
          {list.length === 0 && (
            <li className="pl-6 text-sm text-mute">
              선택한 유형의 기록이 아직 제공되지 않았습니다.
            </li>
          )}
          {list.map((t, i) => (
            <li key={i} className="pl-6 relative">
              <span
                className={`absolute -left-[9px] top-1.5 w-4 h-4 border-2 border-ink ${
                  t.status === "확정" ? "bg-ink" : "bg-paper border-dashed"
                } ${t.kind === "발의" ? "" : "rounded-full"}`}
              />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs text-mute">{t.date}</span>
                <span className="text-[11px] border border-ink px-1.5">
                  {t.kind}
                </span>
                <Badge status={t.status} />
              </div>
              <h3 className="font-serif font-bold text-lg">{t.title}</h3>
              <p className="text-[15px] leading-7 text-ink/85 max-w-[68ch]">
                {t.body}
              </p>
              <p className="text-xs text-mute mt-1">
                출처 {t.src} (가상) ·{" "}
                <SourceButton
                  details={{
                    title: t.title,
                    org: t.src,
                    date: t.date,
                    summary: t.body,
                  }}
                >
                  자료 안내
                </SourceButton>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 02 분야별 */}
      <section className="mt-16">
        <SectionHead no="02" title="정책 분야별 활동" />
        <div className="grid md:grid-cols-3 gap-4">
          {areas.map((a, i) => (
            <div
              key={a.name}
              className={`border ${
                openArea === i
                  ? "border-brand bg-white"
                  : "border-rule bg-white"
              }`}
            >
              <button
                onClick={() => setOpenArea(openArea === i ? -1 : i)}
                aria-expanded={openArea === i}
                className="w-full flex items-baseline justify-between p-4 text-left"
              >
                <span className="font-serif font-bold text-xl">{a.name}</span>
                <span>
                  <span className="font-mono text-3xl text-brand">{a.n}</span>
                  <span className="text-xs text-mute ml-1">건</span>
                </span>
              </button>
              {openArea === i && (
                <ul className="px-4 pb-4 space-y-2 text-sm border-t border-rule pt-3 fade-up">
                  {a.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="text-brand">▪</span>
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {primary ? (
        <>
          {/* 03 3년 기록 */}
          <section className="mt-16">
            <SectionHead
              no="03"
              title="최근 3년의 기록"
              desc="모든 연도에 같은 정의와 기준을 적용했습니다"
            />
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
              <div className="bg-white border border-rule p-5">
                <div className="flex flex-wrap gap-2 mb-5">
                  {Object.entries(YEARS).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setMetric(k)}
                      aria-pressed={metric === k}
                      className={`text-sm px-3 py-1.5 border ${
                        metric === k
                          ? "bg-pale border-brand text-brand font-medium"
                          : "border-rule hover:border-ink"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <svg
                  viewBox="0 0 400 220"
                  className="w-full"
                  role="img"
                  aria-label={`${m.label} 연도별 막대 차트`}
                >
                  {[0, 0.5, 1].map((g) => (
                    <line
                      key={g}
                      x1="30"
                      x2="390"
                      y1={180 - g * 150}
                      y2={180 - g * 150}
                      stroke="#e3e1da"
                    />
                  ))}
                  {m.v.map((v, i) => {
                    const h = (v / max) * 150
                    const last = i === 2
                    return (
                      <g key={i} transform={`translate(${70 + i * 115} 0)`}>
                        <rect
                          y={180 - h}
                          width="64"
                          height={h}
                          fill={last ? "#EFECFF" : "#6250D8"}
                          stroke="#6250D8"
                          strokeWidth="1.5"
                          strokeDasharray={last ? "5 3" : undefined}
                          className="transition-all duration-500"
                        />
                        <text
                          x="32"
                          y={172 - h}
                          textAnchor="middle"
                          fontSize="15"
                          fontWeight="500"
                          fill="#20222A"
                          fontFamily="JetBrains Mono"
                        >
                          {v}
                          {m.unit}
                        </text>
                        <text
                          x="32"
                          y="200"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#626774"
                          fontFamily="JetBrains Mono"
                        >
                          {YR[i]}
                        </text>
                      </g>
                    )
                  })}
                </svg>
                <p className="text-xs text-mute">
                  * 2026년은 10월 8일까지의 부분 기간이며 점선으로 표시했습니다.
                  연간 합계와 직접 비교하지 마세요.
                </p>
              </div>
              <dl className="text-sm space-y-4">
                <div>
                  <dt className="font-bold">지표 정의</dt>
                  <dd className="text-mute mt-1">{m.note}</dd>
                </div>
                <div>
                  <dt className="font-bold">비교 기준</dt>
                  <dd className="text-mute mt-1">
                    매년 1월 1일~12월 31일, 같은 의안정보시스템 분류 기준 적용.
                    임기 시작 전 기간은 제외.
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">읽을 때 유의점</dt>
                  <dd className="text-mute mt-1">
                    발의 건수가 많다고 성과가 큰 것은 아닙니다. 처리
                    결과(가결)와 함께 보세요.
                  </dd>
                </div>
                <SourceButton
                  details={{
                    title: `${m.label} 집계 안내`,
                    summary: m.note,
                    lines: [
                      "2024·2025년: 연간 집계",
                      "2026년: 10월 8일까지의 부분 기간",
                      "가상 수치이며 실제 의안 목록이 연결되지 않았습니다.",
                    ],
                  }}
                  className="font-medium inline-block"
                >
                  집계 자료 안내
                </SourceButton>
              </dl>
            </div>
          </section>

          {/* 04 지표 */}
          <section className="mt-16">
            <SectionHead no="04" title="핵심 활동 지표" />
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  k: "본회의·상임위 출석률",
                  v: 96.7,
                  basis:
                    "출석 회의 수 ÷ 소집된 회의 수 (청가·공무 출장은 출석 불인정)",
                  rec: "소집 123회 중 출석 119회 (본회의 41회 · 상임위 78회)",
                },
                {
                  k: "표결 참여율",
                  v: 91.0,
                  basis: "표결 참여 수 ÷ 전체 표결 수. 기권·불참 구분 공개",
                  rec: "총 212건 중 193건 참여",
                },
                {
                  k: "발의 법안 반영률",
                  v: 30.3,
                  basis:
                    "대표발의 법안 33건 중 가결·대안 반영 10건의 비율. 가중치 없음",
                  rec: "발의 33건 중 10건 반영",
                },
              ].map((c) => (
                <div key={c.k} className="bg-white border border-rule p-5">
                  <p className="text-sm text-mute">{c.k}</p>
                  <p className="font-mono text-5xl text-brand mt-1">
                    {c.v}
                    <span className="text-2xl">%</span>
                  </p>
                  <div className="h-1.5 bg-pale mt-3">
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${c.v}%` }}
                    />
                  </div>
                  <p className="text-xs text-mute mt-2">
                    기간 2024.05.30~2026.10.08
                  </p>
                  <details className="mt-3 text-sm group">
                    <summary className="cursor-pointer text-brand font-medium list-none flex items-center gap-1">
                      <span className="group-open:rotate-90 transition-transform">
                        ▸
                      </span>{" "}
                      계산 기준과 근거
                    </summary>
                    <p className="mt-2 leading-6">{c.basis}</p>
                    <p className="text-mute mt-1 text-xs">
                      {c.rec} ·{" "}
                      <SourceButton
                        details={{
                          title: c.k,
                          summary: c.basis,
                          lines: [
                            c.rec,
                            "집계 기간: 2024.05.30~2026.10.08",
                            "가상 집계이며 반올림은 소수점 첫째 자리까지 적용",
                          ],
                        }}
                      >
                        자료 안내
                      </SourceButton>
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="mt-16">
          <SectionHead no="03" title="활동 지표" />
          <p className="text-mute leading-7 bg-white border border-rule p-5">
            이 의원의 연도별 기록과 집계 자료는 아직 제공되지 않았습니다. 다른
            의원의 수치를 대신 표시하지 않습니다.
          </p>
        </section>
      )}
      {/* 05 공개 정보 */}
      <section className="mt-16">
        <SectionHead no="05" title="공개 정보와 시민 질문" />
        <div className="flex flex-wrap border-b border-rule mb-5" role="group">
          {[...Object.keys(DISC), "시민 질문"].map((t) => (
            <button
              key={t}
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 ${
                tab === t
                  ? "border-brand text-brand"
                  : "border-transparent text-mute hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab !== "시민 질문" ? (
          <div className="bg-white border border-rule p-5 fade-up">
            <ul className="space-y-3 text-[15px]">
              {(primary
                ? DISC[tab]
                : tab === "경력"
                  ? [
                      `${p.committee} · ${p.term}`,
                      `${p.district} · 가상 프로필`,
                    ]
                  : ["이 의원의 공개 자료는 아직 연결되지 않았습니다."]
              ).map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="text-brand">▪</span>
                  {l}
                </li>
              ))}
            </ul>
            <p className="text-xs text-mute mt-4">
              가상 프로필·수치 · 실제 공개 자료는 연결 전입니다
            </p>
          </div>
        ) : (
          <div className="bg-white border border-rule p-5 fade-up">
            <LawmakerQuestions id={id} />
          </div>
        )}
      </section>
    </div>
  )
}
