import { SourceLink } from "../../../components/common/SourceLink"
export function RecordTimeline({ items }) {
  return (
    <ol className="record-timeline">
      {items.map((item) => (
        <li key={item.id}>
          <time>{item.date}</time>
          <span className="soft-tag">{item.kind}</span>
          <p>
            {item.title}
            {item.count > 1 && (
              <small className="ml-2 text-mute">
                외 관련 기록 · 총 {item.count}건
              </small>
            )}
            {item.url && (
              <span className="ml-3">
                <SourceLink url={item.url}>원문</SourceLink>
              </span>
            )}
          </p>
        </li>
      ))}
      {!items.length && (
        <li className="text-mute">해당 유형의 기록이 아직 없어요.</li>
      )}
    </ol>
  )
}
