import { IMG } from "./data"
import { Img } from "./ui"
import { useDetails } from "./DetailsDialog"
export default function VideoPanel({ compact = false }) {
  const open = useDetails()
  return (
    <div>
      <div className="relative bg-ink text-white">
        <Img
          src={IMG.chamber}
          alt="첨부 디자인의 의회 참고 이미지 · 실제 영상 미연결"
          className={`${compact ? "aspect-video" : "aspect-[16/10]"} w-full`}
        />
        <button
          onClick={() =>
            open({
              title: "공식 영상 연결 전",
              summary:
                "이 자리는 의원의 공식 인스타그램 영상과 국감 영상을 연결할 공간입니다. 현재는 원본 디자인의 참고 이미지만 제공됩니다.",
              lines: [
                "김서윤 · 가상 의원",
                "공식 계정: 미연결 · 실제 게시일: 확인 전",
                "발언 예시: 피해자 인정 범위를 넓히고 보증금 반환 지연 사유를 공개해야 합니다.",
                "관련 입법 예시: 전세사기피해자법 개정안(A) · 현재 제안 단계",
              ],
            })
          }
          aria-label="영상 연결 상태와 발언 요약 보기"
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white text-brand grid place-items-center hover:scale-105 transition-transform"
        >
          <svg width="20" height="20" aria-hidden="true">
            <path d="M5 3l12 7-12 7z" fill="currentColor" />
          </svg>
        </button>
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-xs flex justify-between gap-3">
          <span>영상 안내 보기</span>
          <span>참고 이미지 · 실제 영상 미연결</span>
        </div>
      </div>
    </div>
  )
}
