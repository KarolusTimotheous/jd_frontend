import { IMG, ISSUE_TITLE } from "./data"
import { Img, Initial, Label, SectionHead, Badge } from "./ui"
import { useDemo } from "./DemoState"
import { CitizenDiscussion } from "./Conversation"
import VideoPanel from "./VideoPanel"
const BRIEFS = [
  {
    tag: "법안",
    title: "법안소위, 전세사기 3개 법안 병합 심사 착수",
    change: "개별 심사 → 병합 심사로 전환",
    time: "2시간 전",
  },
  {
    tag: "예산",
    title: "긴급주거지원 예산, 상임위 예비심사 돌입",
    change: "1,240억 원 · 전년 대비 +18.4%",
    time: "5시간 전",
  },
  {
    tag: "국감",
    title: "보증기관, 반환 지연 사례 자료 제출 약속",
    change: "10월 20일까지 · 이행 여부 미확인",
    time: "어제",
  },
]
const FOLLOWS = [
  {
    kind: "법안",
    name: "전세사기피해자법 개정안(A)",
    from: "소관위 계류",
    to: "법안소위 회부",
    status: "제안",
    date: "10.07",
  },
  {
    kind: "의원",
    name: "김서윤 의원",
    from: "질의 1회",
    to: "질의 2회 · 수정안 제출",
    status: "제안",
    date: "10.07",
  },
  {
    kind: "법안",
    name: "주택임대차보호법 개정안(B)",
    from: "발의",
    to: "병합 심사 대상 지정",
    status: "제안",
    date: "10.06",
  },
]
export default function Home({ onExplore, onNotebook, onIssue }) {
  const { state, update } = useDemo()
  const vote = state.vote
  const counts = [578, 373, 253].map(
    (count, index) => count + (vote === index ? 1 : 0),
  )
  const total = counts.reduce((sum, count) => sum + count, 0)
  const pct = counts.map((count) => Math.round((count / total) * 100))
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-8 fade-up">
      <div className="flex items-end justify-between border-b border-rule pb-3 mb-8">
        <div>
          <Label>2026년 10월 8일 목요일 · 제 4호</Label>
          <h1 className="font-serif font-black text-3xl md:text-4xl mt-1">
            오늘의 국회
          </h1>
        </div>
        <p className="hidden md:block text-sm text-mute">정치의 맥락을 읽다</p>
      </div>

      {/* 메인 이슈 + 브리핑 */}
      <section className="grid lg:grid-cols-[1.75fr_1fr] gap-10 lg:gap-12">
        <article>
          <div className="relative">
            <Img
              src={IMG.hero}
              alt="의회 본회의장 참고 이미지"
              className="aspect-[16/10] w-full"
            />
            <span className="absolute left-0 top-0 bg-brand text-white font-mono text-[11px] px-3 py-1.5 tracking-wider">
              TODAY’S ISSUE
            </span>
          </div>
          <p className="text-xs text-mute mt-2">
            사진: 의회 본회의장 참고 이미지 · 출처 Unsplash
          </p>
          <h2 className="font-serif font-black text-[32px] md:text-[46px] leading-[1.18] mt-5 text-balance">
            {ISSUE_TITLE}
          </h2>
          <p className="mt-5 text-[17px] leading-8 text-ink/90 max-w-[62ch]">
            국토교통위 법안소위가 전세사기 관련 법안 세 건을 한꺼번에 심사하기
            시작했습니다. 쟁점은 피해자 인정 보증금 상한을 7억 원으로 올릴지,
            임차권 보호와 예방 중심으로 갈지입니다. 현재 모든 안은 제안
            단계이며, 보증기관은 자료 제출을 약속했습니다. 실제 제출 여부는 아직
            확인되지 않았습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onExplore()}
              className="group bg-brand hover:bg-brand-dark text-white font-medium px-5 py-3 rounded-sm flex items-center gap-2 transition-colors"
            >
              맥락 탐험하기
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              onClick={onIssue}
              className="border border-rule px-5 py-3 text-sm font-medium hover:bg-pale"
            >
              영상·법안·질문 함께 보기
            </button>
            <span className="text-xs text-mute">
              법안 3 · 의원 4 · 예산 2 · 국감 기록 2건 연결
            </span>
          </div>
        </article>

        <aside>
          <SectionHead no="01" title="3줄 브리핑" />
          <ol className="divide-y divide-rule">
            {BRIEFS.map((b, i) => (
              <li key={i} className="py-4 first:pt-0 group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] border border-ink px-1.5 py-px">
                    {b.tag}
                  </span>
                  <span className="text-xs text-mute ml-auto">{b.time}</span>
                </div>
                <h3 className="font-serif font-bold text-lg leading-snug">
                  <button
                    className="text-left hover:text-brand"
                    onClick={() => onExplore(["b1", "bd", "au"][i])}
                  >
                    {b.title}
                  </button>
                </h3>
                <p className="text-sm mt-1.5 bg-pale text-brand-dark px-2 py-1 inline-block">
                  바뀐 점 · {b.change}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* 국감 하이라이트 */}
      <section className="mt-16">
        <SectionHead
          no="02"
          title="오늘의 국감 하이라이트"
          desc="질의 → 답변 → 후속 조치"
        />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <VideoPanel compact />
          <dl className="space-y-4">
            {[
              [
                "질의",
                "전세사기 보증금 반환이 평균 얼마나 지연되고 있으며, 그 사유는 무엇입니까?",
                "ink",
              ],
              [
                "답변",
                "평균 94일이며 서류 보완이 주된 사유입니다. 사례별 자료를 제출하겠습니다.",
                "ink",
              ],
              [
                "후속",
                "10월 20일까지 사례별 자료 제출 · 제출 후 상임위에서 개선안 재질의",
                "brand",
              ],
            ].map(([k, v, c]) => (
              <div
                key={k}
                className="grid grid-cols-[56px_1fr] gap-3 border-l-2 pl-4"
                style={{ borderColor: c === "brand" ? "#6250D8" : "#20222A" }}
              >
                <dt
                  className={`font-serif font-bold ${
                    c === "brand" ? "text-brand" : ""
                  }`}
                >
                  {k}
                </dt>
                <dd className="text-[15px] leading-7">{v}</dd>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Badge status="확정" />
              <span className="text-xs text-mute">
                출처 국정감사 회의록(가상) · 2026.10.06
              </span>
            </div>
            <button
              onClick={() => onNotebook("l1")}
              className="text-sm text-brand font-medium underline underline-offset-4 decoration-1"
            >
              질의한 김서윤 의원 업무노트 보기 →
            </button>
          </dl>
        </div>
      </section>

      {/* 팔로우 + 오늘의 질문 */}
      <section className="mt-16 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <div>
          <SectionHead no="03" title="팔로우한 주제의 변화" />
          <ul className="space-y-3">
            {FOLLOWS.map((f) => (
              <li
                key={f.name}
                className="bg-white border border-rule p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] border border-ink px-1.5">
                      {f.kind}
                    </span>
                    <span className="font-mono text-xs text-mute">
                      {f.date}
                    </span>
                    <Badge status={f.status} />
                  </div>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-mute mt-1">
                    <span className="line-through">{f.from}</span>{" "}
                    <span className="text-brand mx-1">→</span>
                    <span className="text-ink font-medium">{f.to}</span>
                  </p>
                </div>
                {f.kind === "의원" ? (
                  <button
                    onClick={() => onNotebook("l1")}
                    className="text-sm bg-pale text-brand font-medium px-3 py-2 rounded-sm hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
                  >
                    업무노트 보기
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      onExplore(f.name.includes("(B)") ? "b2" : "b1")
                    }
                    className="text-sm bg-pale text-brand font-medium px-3 py-2 rounded-sm hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
                  >
                    맥락 탐험하기
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHead no="04" title="오늘의 질문" />
          <div className="bg-white border border-rule p-5">
            <p className="font-serif font-bold text-xl leading-snug">
              피해자 인정 보증금 상한, 어떻게 정해야 할까요?
            </p>
            <div className="mt-4 space-y-2">
              {[
                "7억 원으로 확대 (A안)",
                "현행 유지, 권리 보호 강화 (B안)",
                "예방 중심으로 전환 (C안)",
              ].map((o, i) => (
                <button
                  key={o}
                  onClick={() => update((s) => ({ ...s, vote: i }))}
                  aria-pressed={vote === i}
                  className={`relative w-full text-left text-sm px-3 py-2.5 border overflow-hidden ${
                    vote === i ? "border-brand" : "border-rule hover:border-ink"
                  }`}
                >
                  {vote !== null && (
                    <span
                      className="absolute inset-y-0 left-0 bg-pale"
                      style={{ width: `${pct[i]}%` }}
                    />
                  )}
                  <span className="relative flex justify-between gap-2">
                    <span className={vote === i ? "font-bold text-brand" : ""}>
                      {vote === i ? "✓ " : ""}
                      {o}
                    </span>
                    {vote !== null && (
                      <span className="font-mono">{pct[i]}%</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-mute mt-2">
              {vote === null
                ? "투표하면 결과를 볼 수 있어요"
                : `참여 ${total.toLocaleString()}명 · 가상 집계 · 내 선택 1회 반영`}
            </p>
            {vote !== null && (
              <button
                onClick={() => update((s) => ({ ...s, vote: null }))}
                className="text-xs text-brand underline mt-2"
              >
                내 선택 취소
              </button>
            )}
            <div className="mt-4">
              <CitizenDiscussion />
            </div>
            <button
              onClick={onIssue}
              className="text-sm text-brand font-medium underline underline-offset-4 mt-3"
            >
              관련 법안 읽고 의원에게 질문하기
            </button>
          </div>
        </div>
      </section>

      {/* 이 이슈의 의원 */}
      <section className="mt-16">
        <SectionHead no="05" title="이 이슈에 움직인 의원" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["l1", "김서윤", "A안 대표발의 · 국감 질의"],
            ["l2", "박도현", "A안 공동발의"],
            ["l3", "이하은", "B안 대표발의"],
            ["l4", "최민재", "예산 심사 조율"],
          ].map(([id, n, r]) => (
            <div
              key={id}
              className="bg-white border border-rule p-4 flex items-center gap-4 hover:border-brand transition-colors"
            >
              <Initial name={n} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-serif font-bold text-lg">
                  {n}{" "}
                  <span className="text-[10px] font-sans font-normal text-mute">
                    가상
                  </span>
                </p>
                <p className="text-xs text-mute truncate">{r}</p>
                <button
                  onClick={() => onNotebook(id)}
                  className="text-sm text-brand font-medium mt-1.5"
                >
                  업무노트 보기 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
