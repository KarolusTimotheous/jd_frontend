import { SourceLink } from "../../../components/common/SourceLink"
import { timeLabel } from "../../../utils/formatters"
export function BillContent({ bill }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="soft-tag">{bill.relation}</span>
        <span className="soft-tag ink-tag">
          {bill.result || "처리 결과 미확인"}
        </span>
      </div>
      <h3 className="font-serif font-bold text-xl leading-relaxed">
        {bill.title}
      </h3>
      <dl className="fact-list">
        <div>
          <dt>의안번호</dt>
          <dd>{bill.number}</dd>
        </div>
        <div>
          <dt>제안일</dt>
          <dd>{bill.proposed || "미확인"}</dd>
        </div>
        <div>
          <dt>소관위원회</dt>
          <dd>{bill.committee || "미확인"}</dd>
        </div>
        {bill.decided && (
          <div>
            <dt>의결일</dt>
            <dd>{bill.decided}</dd>
          </div>
        )}
        {bill.promulgated && (
          <div>
            <dt>공포일</dt>
            <dd>{bill.promulgated}</dd>
          </div>
        )}
      </dl>
      {bill.text ? (
        <details className="source-excerpt">
          <summary>제안이유와 주요내용 원문 읽기</summary>
          <p className="whitespace-pre-wrap leading-8 text-sm mt-4">
            {bill.text}
          </p>
        </details>
      ) : (
        <p className="text-sm text-mute my-4">
          제안이유는 의안 원문에서 확인할 수 있어요.
        </p>
      )}
      <SourceLink url={bill.sourceUrl}>국회 의안정보 원문</SourceLink>
      {bill.mode === "stale" && (
        <p className="text-xs text-mute mt-3">
          의안 상세 · {timeLabel(bill.fetchedAt)} 마지막 확인본
        </p>
      )}
    </div>
  )
}
