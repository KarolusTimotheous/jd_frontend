import { useState } from "react"
import { SOURCE } from "../../features/laws/constants"
import { Img } from "../../components/common/Img"
import { SectionHead } from "../../components/common/SectionHead"
import { SourceLink } from "../../components/common/SourceLink"
import { DataStamp } from "../../components/common/DataStamp"
export default function HomePage({ feed, refreshing, refresh, explore }) {
  const [search, setSearch] = useState("")
  const main = feed.items[0]
  const laws = feed.items.filter((l) =>
    `${l.name} ${l.issue}`.includes(search.trim()),
  )
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString("ko-KR", {
              timeZone: "Asia/Seoul",
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
          <h1>
            오늘의 국회<span className="title-dot">.</span>
          </h1>
        </div>
        <p className="hidden md:block text-sm text-mute">
          세상의 이슈를, 법률의 맥락으로.
        </p>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-7">
        <DataStamp data={feed} />
        <button
          className="text-sm font-bold text-brand disabled:opacity-50"
          disabled={refreshing}
          onClick={refresh}
        >
          {refreshing ? "최신 목록 확인 중…" : "↻ 최신 목록 새로고침"}
        </button>
      </div>
      <section className="grid lg:grid-cols-[1.65fr_1fr] gap-9 lg:gap-12">
        <article>
          <div className="relative">
            <Img
              src="./images/assembly.jpg"
              alt="의회 본회의장 참고 이미지"
              className="aspect-[16/9] w-full"
            />
            <span className="image-label">
              LAW & CONTEXT <span className="ml-5">01 / 20</span>
            </span>
          </div>
          <p className="text-[10px] text-mute mt-2">
            의회 본회의장 참고 이미지 · Unsplash
          </p>
          <p className="eyebrow mt-5">
            {main.name}{" "}
            <span className="text-mute">— {main.updated} 이슈 업데이트</span>
          </p>
          <h2 className="font-serif font-black text-3xl md:text-[42px] leading-[1.3] mt-3">
            {main.issue || main.name}
          </h2>
          <p className="leading-8 text-mute mt-4 line-clamp-3">
            {main.summary || "이 법률에 연결된 이슈와 입법 기록을 살펴보세요."}
          </p>
          <p className="text-[11px] text-mute mt-2">
            아르고스 AI 설명 · 원문 확인이 필요한 자동 요약
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button className="primary-button" onClick={() => explore(main.id)}>
              맥락 탐험하기 <span aria-hidden>→</span>
            </button>
            <span className="text-xs text-mute">
              이슈에서 법안으로, 법안에서 사람으로
            </span>
          </div>
        </article>
        <aside>
          <SectionHead
            no="01"
            title="함께 읽을 법률"
            desc="아르고스 업데이트순 2–5"
          />
          <div className="divide-y divide-rule">
            {feed.items.slice(1, 5).map((law) => (
              <article key={law.id} className="brief-row">
                <div className="flex justify-between gap-2">
                  <span className="eyebrow">
                    {String(law.rank).padStart(2, "0")} · {law.name}
                  </span>
                  <time className="text-[10px] text-mute shrink-0">
                    {law.updated.slice(5).replace("-", ".")}
                  </time>
                </div>
                <h3 className="font-serif font-bold text-xl leading-relaxed mt-2">
                  <button
                    className="text-left hover:text-brand"
                    onClick={() => explore(law.id)}
                  >
                    {law.issue || law.name}
                  </button>
                </h3>
                <p className="text-sm leading-6 text-mute line-clamp-2 mt-2">
                  {law.summary}
                </p>
              </article>
            ))}
          </div>
          <p className="text-[11px] text-mute mt-3">
            요약 출처 · 국회도서관 아르고스 AI 설명
          </p>
        </aside>
      </section>
      <div className="reading-path mt-12">
        <span className="eyebrow">정독하는 순서</span>
        <p>
          이슈를 발견하고 <span>→</span> 법률의 흐름을 읽고 <span>→</span>{" "}
          의원의 일을 확인하고 <span>→</span> 내 생각을 남겨요.
        </p>
      </div>
      <section className="mt-14" id="law-list">
        <SectionHead
          no="02"
          title="오늘 연결된 20개의 법률"
          desc="인기 순위가 아닌, 원본의 업데이트 순서입니다."
        />
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <p className="text-xs text-mute self-center">
            상위 20개 내 검색 · 새로고침해도 원본이 같으면 목록은 유지돼요.
          </p>
          <label className="search-box">
            <span aria-hidden>⌕</span>
            <input
              aria-label="20개 법률 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="법률명 또는 이슈 검색"
            />
            <span className="text-xs text-mute">{laws.length}/20</span>
          </label>
        </div>
        <div className="law-grid">
          {laws.map((law) => (
            <button
              className="law-card"
              key={law.id}
              onClick={() => explore(law.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-brand">
                  {String(law.rank).padStart(2, "0")}
                </span>
                <time className="text-[10px] text-mute">{law.updated}</time>
              </div>
              <h3 className="font-serif font-bold text-xl mt-4">{law.name}</h3>
              <p className="text-sm text-mute leading-6 mt-2 min-h-12">
                {law.issue || "연결된 입법 기록 살펴보기"}
              </p>
              <div className="text-xs text-brand mt-6 flex justify-between">
                <span>맥락 살펴보기</span>
                <span aria-hidden>↗</span>
              </div>
            </button>
          ))}
        </div>
        {!laws.length && (
          <div className="empty-state">
            이 20개 법률 안에는 검색 결과가 없어요.{" "}
            <button
              className="text-brand underline"
              onClick={() => setSearch("")}
            >
              전체 보기
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-3 justify-between mt-5 text-xs text-mute">
          <p>자료 제공 · 국회도서관 아르고스 ‘법률과 이슈’</p>
          <SourceLink url={SOURCE}>원본 목록 보기</SourceLink>
        </div>
      </section>
    </div>
  )
}
