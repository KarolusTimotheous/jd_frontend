import { timeLabel } from "../../utils/formatters"
export function DataStamp({ data }) {
  return (
    <div className={`data-stamp ${data.mode === "stale" ? "is-stale" : ""}`}>
      <span className="status-dot" />
      <span>
        {data.mode === "stale" ? "마지막 확인본" : "공개 자료 연결"} ·{" "}
        {timeLabel(data.fetchedAt)} 확인
      </span>
      {data.warning && <span>{data.warning}</span>}
    </div>
  )
}
