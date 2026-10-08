import { PersonAvatar } from "./PersonAvatar"
import { termLabel } from "../../../utils/formatters"
export function PersonCard({ person, onClick }) {
  return (
    <button className="person-card" onClick={onClick}>
      <div className="flex gap-4 items-center">
        <PersonAvatar person={person} />
        <div>
          <span className="eyebrow">대표발의 · {termLabel(person)}</span>
          <h3 className="font-serif font-bold text-2xl mt-1">
            {person.name} <span className="text-sm font-normal">의원</span>
          </h3>
        </div>
      </div>
      <p className="text-sm text-mute mt-5">
        이 법률에서 확인된 의안 {person.billIds.length}건
      </p>
      <p className="text-sm text-brand mt-5 flex justify-between">
        <span>의원의 업무노트</span>
        <span>→</span>
      </p>
    </button>
  )
}
