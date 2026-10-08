import { useState } from "react"
import { SectionHead } from "../../components/common/SectionHead"
import { SourceLink } from "../../components/common/SourceLink"
import { DataStamp } from "../../components/common/DataStamp"
import { BillContent } from "../../features/laws/components/BillContent"
import { RecordTimeline } from "../../features/laws/components/RecordTimeline"
import { PersonAvatar } from "../../features/lawmakers/components/PersonAvatar"
import { PersonCard } from "../../features/lawmakers/components/PersonCard"
import { termLabel } from "../../utils/formatters"
const branches = [
  {
    id: "issue",
    label: "지금의 이슈",
    sub: "왜 다시 주목받을까",
    shape: "circle",
    x: 19,
    y: 25,
  },
  {
    id: "bill",
    label: "입법 기록",
    sub: "어떤 변화가 제안됐나",
    shape: "document",
    x: 81,
    y: 25,
  },
  {
    id: "history",
    label: "법률의 발자취",
    sub: "언제 무엇이 달라졌나",
    shape: "diamond",
    x: 19,
    y: 76,
  },
  {
    id: "people",
    label: "연결된 의원",
    sub: "누가 발의했을까",
    shape: "person",
    x: 81,
    y: 76,
  },
]
export default function ExplorePage({ detail, node, selectNode, notebook }) {
  const [billId, setBillId] = useState(detail.bills[0]?.id)
  const bill = detail.bills.find((b) => b.id === billId) || detail.bills[0]
  const active = branches.find((b) => b.id === node) || branches[0]
  const [allHistory, setAllHistory] = useState(false)
  const [allBills, setAllBills] = useState(false)
  function chooseNode(id) {
    selectNode(id)
    if (window.innerWidth < 1024)
      requestAnimationFrame(() =>
        document
          .getElementById("context-info")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      )
  }
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONTEXT EXPLORER</p>
          <h1>
            국회탐험<span className="title-dot">.</span>
          </h1>
        </div>
        <SourceLink url={detail.law.sourceUrl}>아르고스 원문</SourceLink>
      </div>
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <p className="text-mute text-sm">
          도형 하나에서 시작해, 연결된 기록을 따라가 보세요.
        </p>
        <DataStamp data={detail} />
      </div>
      {detail.warnings.map((w) => (
        <p role="status" className="notice mb-4" key={w}>
          {w}
        </p>
      ))}
      <section className="context-layout">
        <div className="context-map">
          <div className="flex justify-between text-[11px] text-mute p-5">
            <span>관계 지도 · 선택해서 펼쳐보기</span>
            <span>연결 4개</span>
          </div>
          <div className="graph-scene">
            <svg
              viewBox="0 0 700 420"
              preserveAspectRatio="none"
              className="graph-lines"
              aria-hidden
            >
              <path
                d="M350 210 Q260 210 133 105 M350 210 Q430 210 567 105 M350 210 Q260 210 133 319 M350 210 Q440 210 567 319"
                fill="none"
                stroke="#cec8e6"
                strokeWidth="1.5"
                strokeDasharray="4 5"
              />
            </svg>
            <div className="graph-center">
              <span className="text-[10px] tracking-widest opacity-70">
                LAW
              </span>
              <h2>{detail.law.name}</h2>
            </div>
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => chooseNode(b.id)}
                aria-controls="context-info"
                aria-pressed={active.id === b.id}
                className={`graph-node ${active.id === b.id ? "selected" : ""}`}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
              >
                <span className={`node-symbol ${b.shape}`} aria-hidden>
                  {b.id === "issue"
                    ? "!"
                    : b.id === "bill"
                      ? "≡"
                      : b.id === "history"
                        ? "↗"
                        : "♙"}
                </span>
                <strong>{b.label}</strong>
                <small>
                  {b.id === "people"
                    ? `${detail.people.length}명 · 확인된 발의 의원`
                    : b.sub}
                </small>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-mute px-5 pb-5">
            선은 관련 자료의 연결을 뜻해요. 이슈의 원인이나 의원의 책임을 뜻하지
            않아요.
          </p>
        </div>
        <aside id="context-info" className="context-info" aria-live="polite">
          <p className="eyebrow mb-4">
            READING{" "}
            {String(branches.findIndex((b) => b.id === active.id) + 1).padStart(
              2,
              "0",
            )}{" "}
            / 04
          </p>
          {active.id === "issue" && (
            <>
              <span className="soft-tag">아르고스 AI 설명</span>
              <h3 className="font-serif text-2xl font-bold leading-relaxed mt-4">
                {detail.law.issue || detail.law.name}
              </h3>
              <p className="text-sm leading-8 mt-4">
                {detail.law.summary ||
                  "이 이슈의 자동 요약이 제공되지 않았어요."}
              </p>
              <p className="text-xs text-mute mt-4">
                원문을 확인하기 위한 길잡이입니다. 이 설명을 정독이 별도로 사실
                확인한 것은 아닙니다.
              </p>
              <button
                className="text-brand text-sm font-bold mt-6"
                onClick={() => selectNode("bill")}
              >
                관련 입법 기록으로 →
              </button>
            </>
          )}
          {active.id === "bill" &&
            (bill ? (
              <>
                <label
                  className="text-xs text-mute block mb-2"
                  htmlFor="map-bill"
                >
                  연결된 의안 선택
                </label>
                <select
                  id="map-bill"
                  value={bill.id}
                  onChange={(e) => setBillId(e.target.value)}
                  className="w-full border border-rule p-2 text-sm mb-5"
                >
                  {detail.bills.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.number}]{" "}
                      {b.people.map((p) => p.name).join("·") || b.committee} ·{" "}
                      {b.relation}
                    </option>
                  ))}
                </select>
                <BillContent bill={bill} />
              </>
            ) : (
              <div className="empty-state">
                이 법률의 연결 의안 상세를 아직 확인하지 못했어요.
                <SourceLink url={detail.law.sourceUrl}>
                  원본에서 확인하기
                </SourceLink>
              </div>
            ))}
          {active.id === "history" && (
            <>
              <h3 className="font-serif text-2xl font-bold">
                {detail.fullName}
              </h3>
              <p className="text-xs text-mute mt-3">
                제정일 {detail.enacted || "미확인"} · 아르고스 수록 이력
              </p>
              <RecordTimeline
                items={detail.timeline
                  .filter((t) =>
                    ["제정", "개정", "공포", "시행"].includes(t.kind),
                  )
                  .slice(0, 5)}
              />
              <p className="text-xs text-mute leading-6">
                이슈 업데이트 날짜와 법률의 공포·시행 날짜는 서로 다릅니다.
              </p>
            </>
          )}
          {active.id === "people" && (
            <>
              <h3 className="font-serif text-2xl font-bold mb-4">
                이 법률에 연결된 사람
              </h3>
              <p className="text-xs text-mute leading-6 mb-5">
                해당 국회 대수에서 원안을 대표발의한 의원입니다. 위원회 대안의
                성과를 개인 한 명에게 돌리지 않아요.
              </p>
              {detail.people.slice(0, 5).map((person) => (
                <button
                  className="person-line"
                  key={person.id}
                  onClick={() => notebook(person.id)}
                >
                  <PersonAvatar person={person} />
                  <span>
                    <strong>{person.name}</strong>
                    <small>
                      {termLabel(person)} · 의안 {person.billIds.length}건
                    </small>
                  </span>
                  <span className="ml-auto text-brand">↗</span>
                </button>
              ))}
              {!detail.people.length && (
                <p className="empty-state">
                  개인 발의 의원을 확인하지 못했어요. 위원회·정부 제안은 의안
                  원문에서 확인해 주세요.
                </p>
              )}
              <a
                className="source-link mt-5 inline-flex"
                href="#related-people"
                onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById("related-people")
                    ?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                연결된 의원 모두 보기 ↓
              </a>
            </>
          )}
        </aside>
      </section>
      <section className="mt-14">
        <SectionHead
          no="01"
          title="기록으로 읽는 흐름"
          desc="이슈 · 입법 · 개정 이력을 시간 순서로"
        />
        <RecordTimeline items={detail.timeline.slice(0, allHistory ? 50 : 7)} />
        {detail.timeline.length > 7 && (
          <button
            className="secondary-button mt-3"
            onClick={() => setAllHistory(!allHistory)}
          >
            {allHistory ? "간단히 보기" : `기록 더 보기 · 최대 50개`}
          </button>
        )}
        <p className="text-xs text-mute mt-4">
          아르고스에 수록된 관련 기록입니다. 전체 이력과 관련 회의록은{" "}
          <SourceLink url={detail.law.sourceUrl}>원본에서 확인</SourceLink>할 수
          있어요.
        </p>
      </section>
      <section className="mt-14">
        <SectionHead
          no="02"
          title="개정안과 원안의 연결"
          desc="무엇이 제안됐고, 어떻게 처리됐을까"
        />
        <p className="text-sm leading-7 text-mute mb-5">
          ‘대안반영폐기’는 원안이 별도로 가결된 것이 아니라, 위원회가 마련한
          대안에 통합되어 처리된 상태입니다. 조문별 반영 범위는 원문을 확인해야
          해요.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {detail.bills.slice(0, allBills ? undefined : 4).map((b) => (
            <article className="border border-rule bg-white p-6" key={b.id}>
              <BillContent bill={b} />
            </article>
          ))}
        </div>
        {detail.bills.length > 4 && (
          <button
            className="secondary-button mt-5"
            onClick={() => setAllBills(!allBills)}
          >
            {allBills
              ? "의안 접기"
              : `연결 의안 ${detail.bills.length - 4}건 더 보기`}
          </button>
        )}
        {!detail.bills.length && (
          <p className="empty-state">
            연결 의안의 상세 정보를 확인하지 못했어요.
          </p>
        )}
        <p className="text-xs text-mute mt-4">
          확인 범위 · {detail.scope}
          {detail.alternativeTotal > 20 &&
            ` / 원안 총 ${detail.alternativeTotal}건 중 20건 표시`}
        </p>
      </section>
      <section className="mt-14" id="related-people">
        <SectionHead
          no="03"
          title="이제, 의원의 업무노트로"
          desc="말보다 기록을 먼저 살펴봐요."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {detail.people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onClick={() => notebook(person.id)}
            />
          ))}
        </div>
        {!detail.people.length && (
          <div className="empty-state">
            확인된 개인 발의 의원이 없습니다. 의원을 임의로 연결하지 않았어요.
            <div className="mt-3">
              <SourceLink
                url={detail.bills[0]?.sourceUrl || detail.law.sourceUrl}
              >
                제안자 원문 확인
              </SourceLink>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
