import { SOURCE } from "../../features/laws/constants"
import { SourceLink } from "./SourceLink"
export default function Footer() {
  return (
    <footer className="live-footer">
      <div>
        <p className="font-serif font-bold text-xl">
          정독 · 정치의 맥락을 읽다
        </p>
        <p className="text-xs leading-6 text-mute mt-3">
          이슈 요약 · 국회도서관 아르고스 / 의안과 발의 기록 · 국회
          의안정보시스템
          <br />
          AI 설명과 공식 입법 기록을 구분해 제공합니다. 개인 노트는 현재
          브라우저에 저장됩니다.
        </p>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <SourceLink url={SOURCE}>법률과 이슈 원본</SourceLink>
        <span className="eyebrow">JEONGDOK · READ THE CONTEXT</span>
      </div>
    </footer>
  )
}
