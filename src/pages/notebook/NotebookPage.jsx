import { useState } from "react"
import { SectionHead } from "../../components/common/SectionHead"
import { SourceLink } from "../../components/common/SourceLink"
import { DataStamp } from "../../components/common/DataStamp"
import { BillContent } from "../../features/laws/components/BillContent"
import { PersonAvatar } from "../../features/lawmakers/components/PersonAvatar"
import { PersonCard } from "../../features/lawmakers/components/PersonCard"
import PrivateNotes from "../../features/notes/components/PrivateNotes"
import { termLabel } from "../../utils/formatters"
export default function NotebookPage({ detail, personId, notebook, explore }) {
  const person = detail.people.find((p) => p.id === personId)
  const [noteType, setNoteType] = useState("person")
  if (!person)
    return (
      <div className="page-wrap">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PEOPLE BEHIND THE RECORDS</p>
            <h1>의원의 업무노트</h1>
          </div>
        </div>
        <p className="text-mute mb-7">
          {detail.law.name}에서 확인된 발의 의원을 선택하세요.
        </p>
        {personId && (
          <p className="notice mb-6">
            이 법률의 현재 기록에서 해당 의원을 확인하지 못했어요.
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {detail.people.map((p) => (
            <PersonCard person={p} key={p.id} onClick={() => notebook(p.id)} />
          ))}
        </div>
        {!detail.people.length && (
          <p className="empty-state">확인된 개인 발의 의원이 없습니다.</p>
        )}
        <button className="secondary-button mt-8" onClick={explore}>
          ← 법률 맥락으로 돌아가기
        </button>
        <div className="max-w-2xl mt-10">
          <PrivateNotes
            key={detail.law.id}
            subjectId={`law:${detail.law.id}`}
            subjectName={detail.law.name}
          />
        </div>
      </div>
    )
  const bills = detail.bills.filter((b) => person.billIds.includes(b.id))
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <p className="eyebrow">LAWMAKER’S WORK NOTES</p>
          <h1>
            의원의 업무노트<span className="title-dot">.</span>
          </h1>
        </div>
        <button className="text-brand text-sm" onClick={explore}>
          ← 맥락 지도로
        </button>
      </div>
      <section className="profile-banner">
        <div className="flex gap-6 items-center">
          <PersonAvatar person={person} large />
          <div>
            <p className="eyebrow">
              {termLabel(person)} · 공식 의안정보의 대표발의 의원
            </p>
            <h2 className="font-serif font-bold text-4xl mt-3">
              {person.name} <span className="text-lg">의원</span>
            </h2>
            <p className="text-sm text-mute mt-3">
              {detail.law.name} · {bills[0]?.committee}
            </p>
            <div className="mt-4">
              <SourceLink url={person.profileUrl}>
                국회 공식 의원 소개
              </SourceLink>
            </div>
          </div>
        </div>
        <div className="profile-count">
          <strong>{bills.length.toString().padStart(2, "0")}</strong>
          <span>
            이 법률에서 확인한
            <br />
            대표발의 의안
          </span>
        </div>
      </section>
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 mt-12 items-start">
        <section>
          <SectionHead no="01" title="이 법률에서 한 일" />
          <p className="text-sm leading-7 text-mute mb-6">
            현재 보고 있는 법률에 연결된 활동입니다. 의원의 전체 발의 건수나
            업무 능력 점수가 아니에요.
          </p>
          <DataStamp data={detail} />
          <div className="mt-6 space-y-5">
            {bills.map((bill) => (
              <article
                className="border border-rule p-6 bg-white"
                key={bill.id}
              >
                <BillContent bill={bill} />
              </article>
            ))}
          </div>
          <div className="border-t border-rule mt-7 pt-5">
            <h3 className="font-bold text-sm">더 살펴볼 질문</h3>
            <ul className="mt-3 text-sm text-mute leading-8 list-disc pl-5">
              <li>원안의 어떤 내용이 대안에 반영됐을까?</li>
              <li>공포 이후 실제 시행까지 이어졌을까?</li>
              <li>이 의원의 다른 의제에서는 어떤 활동을 했을까?</li>
            </ul>
            <p className="text-xs text-mute leading-6 mt-4">
              정당·지역구·이력의 최신 정보는 국회 공식 의원 소개에서 확인할 수
              있어요.
            </p>
          </div>
        </section>
        <section className="lg:sticky lg:top-28">
          <div
            className="flex border-b border-rule mb-4"
            role="group"
            aria-label="낙서장 대상"
          >
            <button
              className={`note-tab ${noteType === "person" ? "active" : ""}`}
              aria-pressed={noteType === "person"}
              onClick={() => setNoteType("person")}
            >
              {person.name} 의원에 대한 생각
            </button>
            <button
              className={`note-tab ${noteType === "law" ? "active" : ""}`}
              aria-pressed={noteType === "law"}
              onClick={() => setNoteType("law")}
            >
              법률에 대한 생각
            </button>
          </div>
          <PrivateNotes
            key={noteType === "person" ? person.id : detail.law.id}
            subjectId={
              noteType === "person"
                ? `person:${person.id}`
                : `law:${detail.law.id}`
            }
            subjectName={
              noteType === "person" ? `${person.name} 의원` : detail.law.name
            }
          />
        </section>
      </div>
    </div>
  )
}
