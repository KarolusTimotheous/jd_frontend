import { useState } from "react"
import { ISSUE_TITLE, NODES } from "./data"
import { Badge, Label, SectionHead } from "./ui"
import { CitizenDiscussion, LawmakerQuestions } from "./Conversation"
import { SourceButton } from "./DetailsDialog"
import VideoPanel from "./VideoPanel"
export default function Issue({ billId, onBill, onExplore, onNotebook }) {
  const [discussion, setDiscussion] = useState("question")
  const bill =
    NODES.find((n) => n.id === billId && n.type === "bill") ||
    NODES.find((n) => n.id === "b1")
  const lawmaker = bill.id === "b2" ? "l3" : bill.id === "b1" ? "l1" : null
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-8 fade-up">
      <Label>의제 상세 · 가상 예시</Label>
      <h1 className="font-serif font-black text-3xl md:text-5xl leading-tight mt-2 max-w-[25ch]">
        {ISSUE_TITLE}
      </h1>
      <p className="text-mute leading-7 mt-5 max-w-[68ch]">
        의원이 한 말을 보고, 관련 입법 기록을 읽고, 궁금한 점을 질문해보세요.
        발언과 확인된 기록을 구분해 함께 읽습니다.
      </p>
      <nav
        aria-label="의제 읽기 순서"
        className="flex flex-wrap gap-3 text-sm mt-6 mb-10"
      >
        <a
          className="border border-rule px-4 py-2 hover:bg-pale"
          href="#watch"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("watch")?.scrollIntoView()
          }}
        >
          01 발언 보기
        </a>
        <a
          className="border border-rule px-4 py-2 hover:bg-pale"
          href="#legislation"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("legislation")?.scrollIntoView()
          }}
        >
          02 법안 읽기
        </a>
        <a
          className="border border-rule px-4 py-2 hover:bg-pale"
          href="#questions"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("questions")?.scrollIntoView()
          }}
        >
          03 질문하기
        </a>
      </nav>
      <section id="watch">
        <SectionHead
          no="01"
          title="의원은 무엇을 말했나"
          desc="의원 발언 · 공식 영상 연결 전"
        />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <VideoPanel />
          <div>
            <Label>김서윤 · 가상 의원 / 발언 예시</Label>
            <blockquote className="font-serif font-bold text-2xl md:text-3xl leading-relaxed mt-3">
              “피해자 인정 범위를 넓히고, 보증금 반환이 지연되는 이유를
              확인하겠습니다.”
            </blockquote>
            <p className="mt-5 text-sm text-mute leading-7">
              공식 계정 미연결 · 게시일 확인 전<br />
              인용문은 디자인용 예시입니다. 의원의 설명과 아래 입법 기록은 각각
              확인해야 합니다.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <button
                onClick={() => {
                  onBill("b1")
                  document.getElementById("legislation")?.scrollIntoView()
                }}
                className="bg-brand text-white px-4 py-3 text-sm hover:bg-brand-dark"
              >
                발언과 연결된 A안 읽기
              </button>
              <button
                onClick={() => onNotebook("l1")}
                className="border border-rule px-4 py-3 text-sm hover:bg-pale"
              >
                김서윤 업무노트
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="legislation" className="mt-16">
        <SectionHead
          no="02"
          title="실제로 무엇을 했나"
          desc="원문 확인을 위한 입법 기록 예시"
        />
        <div
          role="group"
          aria-label="비교할 법안 선택"
          className="flex flex-wrap gap-2 mb-6"
        >
          {NODES.filter((n) => n.type === "bill").map((n) => (
            <button
              key={n.id}
              onClick={() => onBill(n.id)}
              aria-pressed={bill.id === n.id}
              className={`px-4 py-2.5 text-sm border ${
                bill.id === n.id
                  ? "bg-brand text-white border-brand"
                  : "border-rule bg-white hover:border-brand"
              }`}
            >
              {n.id === "b1"
                ? "A안 · 지원 확대"
                : n.id === "b2"
                  ? "B안 · 권리 보호"
                  : "C안 · 피해 예방"}
            </button>
          ))}
        </div>
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
          <article className="bg-white border border-rule p-5 md:p-7">
            <Badge status="제안" />
            <h3 className="font-serif font-bold text-2xl mt-3">{bill.title}</h3>
            <p className="text-sm text-mute mt-2">{bill.sub}</p>
            <p className="leading-8 mt-5 border-l-2 border-brand pl-4">
              {bill.one}
            </p>
            <dl className="divide-y divide-rule mt-6 text-sm">
              {bill.info.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[88px_1fr] gap-3 py-3">
                  <dt className="text-mute">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-mute border-t border-rule pt-4 leading-7">
              영상을 게시했다는 사실만으로 법안 발의나 법률 제정 성과가 확인되는
              것은 아닙니다. 이 예시의 법안은 모두 제안 단계입니다.
            </p>
          </article>
          <div>
            <h3 className="font-serif font-bold text-xl mb-4">
              다른 제안과 무엇이 다른가
            </h3>
            {bill.diffs && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-rule bg-white">
                  <thead className="bg-pale text-left">
                    <tr>
                      <th className="p-3">항목</th>
                      <th className="p-3">선택한 법안</th>
                      <th className="p-3">다른 제안</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.diffs.map(([key, value, other]) => (
                      <tr key={key} className="border-t border-rule">
                        <th className="p-3 text-left font-normal text-mute">
                          {key}
                        </th>
                        <td className="p-3">{value}</td>
                        <td className="p-3">{other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h4 className="font-medium mt-6 mb-3">근거 자료</h4>
            <ul className="space-y-3">
              {bill.sources.map((s) => (
                <li key={s.label} className="text-sm">
                  <SourceButton
                    details={{
                      title: s.label,
                      org: s.org,
                      date: s.date,
                      summary: bill.one,
                      lines: bill.info.map(([k, v]) => `${k}: ${v}`),
                    }}
                  >
                    {s.label} 안내
                  </SourceButton>
                  <p className="text-xs text-mute mt-1">
                    {s.org} · {s.date} · 가상 자료
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => onExplore(bill.id)}
                className="bg-brand text-white px-4 py-2.5 text-sm hover:bg-brand-dark"
              >
                이 법안의 맥락 탐험하기
              </button>
              {lawmaker && (
                <button
                  onClick={() => onNotebook(lawmaker)}
                  className="border border-rule px-4 py-2.5 text-sm hover:bg-pale"
                >
                  대표발의 의원 업무노트
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section id="questions" className="mt-16 max-w-[850px]">
        <SectionHead no="03" title="이 부분은 어떻게 생각하나요" />
        <div
          role="group"
          aria-label="대화 유형"
          className="flex border-b border-rule mb-5"
        >
          {[
            ["question", "의원에게 질문"],
            ["citizen", "시민 토론"],
          ].map(([key, label]) => (
            <button
              key={key}
              aria-pressed={discussion === key}
              onClick={() => setDiscussion(key)}
              className={`px-4 py-3 text-sm border-b-2 ${
                discussion === key
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-mute"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="bg-white border border-rule p-5">
          {discussion === "citizen" ? (
            <CitizenDiscussion />
          ) : lawmaker ? (
            <LawmakerQuestions key={lawmaker} id={lawmaker} bill={bill.id} />
          ) : (
            <p className="leading-7 text-mute">
              C안은 정부 제출안 예시로, 연결된 대표발의 의원이 없습니다. 시민
              토론에서 이 제안에 대한 의견을 나눌 수 있어요.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
