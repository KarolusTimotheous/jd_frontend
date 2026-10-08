import { useState } from "react"
export function Img({ src, alt, className = "" }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`bg-[#2c2a3d] overflow-hidden ${className}`}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          onError={() => setOk(false)}
          className="w-full h-full object-cover"
          decoding="async"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full min-h-32 grid place-items-center text-white/80 text-sm p-6 text-center"
        >
          이미지를 불러올 수 없습니다
        </div>
      )}
    </div>
  )
}
export function Badge({ status }) {
  return status === "확정" ? (
    <span className="inline-flex items-center gap-1 bg-ink text-white text-[11px] font-medium px-2 py-0.5 rounded-sm">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path
          d="M1.5 5.5l2.3 2.3L8.5 2.5"
          stroke="#fff"
          strokeWidth="1.6"
          fill="none"
        />
      </svg>
      확인된 기록
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 border border-dashed border-brand text-brand text-[11px] font-medium px-2 py-0.5 rounded-sm">
      <span className="w-1.5 h-1.5 rounded-full border border-brand" />
      제안 · 미확정
    </span>
  )
}
export function Label({ children, className = "" }) {
  return (
    <span
      className={`font-mono text-[11px] tracking-wider uppercase text-mute ${className}`}
    >
      {children}
    </span>
  )
}
export function SectionHead({ no, title, desc }) {
  return (
    <div className="rule-top pt-3 mb-6 flex items-baseline gap-3 flex-wrap">
      <span className="font-mono text-xs text-brand">{no}</span>
      <h2 className="font-serif font-bold text-2xl">{title}</h2>
      {desc && (
        <p className="text-sm text-mute w-full md:w-auto md:ml-2">{desc}</p>
      )}
    </div>
  )
}
export function Initial({ name, size = 56 }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 50 60" aria-hidden>
      <path
        d="M2 58V25a23 23 0 0146 0v33z"
        fill="#EFECFF"
        stroke="#20222A"
        strokeWidth="1.5"
      />
      <circle cx="25" cy="24" r="8" fill="#20222A" />
      <path d="M10 58c0-11 6-17 15-17s15 6 15 17z" fill="#20222A" />
      <title>{name}</title>
    </svg>
  )
}
export function Glyph({ type, state = "idle" }) {
  const sel = state === "selected"
  const lk = state === "linked"
  const fill = sel ? "#6250D8" : lk ? "#EFECFF" : "#FFFFFF"
  const stroke = sel || lk ? "#6250D8" : "#20222A"
  const fg = sel ? "#FFFFFF" : "#20222A"
  const sw = sel ? 2.5 : 1.6
  switch (type) {
    case "issue":
      return (
        <g>
          <circle r="44" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle
            r="37"
            fill="none"
            stroke={stroke}
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
          <text
            y="-4"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={fg}
            fontFamily="Noto Sans KR"
          >
            핵심
          </text>
          <text
            y="12"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={fg}
            fontFamily="Noto Sans KR"
          >
            이슈
          </text>
        </g>
      )
    case "bill":
      return (
        <g>
          <path
            d="M-20 -28h28l12 12v44h-40z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M8 -28v12h12"
            fill="none"
            stroke={stroke}
            strokeWidth="1.4"
          />
          {[-6, 2, 10, 18].map((y) => (
            <line
              key={y}
              x1="-12"
              x2={y === 18 ? 2 : 12}
              y1={y}
              y2={y}
              stroke={fg}
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
        </g>
      )
    case "lawmaker":
      return (
        <g>
          <path
            d="M-24 30V-4a24 24 0 0148 0V30z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cy="-6" r="8" fill={sel ? "#fff" : stroke} />
          <path
            d="M-15 30c0-11 6-17 15-17s15 6 15 17z"
            fill={sel ? "#fff" : stroke}
          />
        </g>
      )
    case "budget":
      return (
        <g>
          <path
            d="M-14 -26h28l14 26-14 26h-28l-14-26z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <text
            y="7"
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill={fg}
            fontFamily="JetBrains Mono"
          >
            ₩
          </text>
        </g>
      )
    case "audit":
      return (
        <g>
          <path
            d="M0 -32l32 32-32 32-32-32z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <circle
            cx="-3"
            cy="-3"
            r="8"
            fill="none"
            stroke={fg}
            strokeWidth="2"
          />
          <line
            x1="3"
            y1="3"
            x2="11"
            y2="11"
            stroke={fg}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )
  }
}
const TABS = [
  { id: "home", no: "01", label: "오늘의 국회" },
  { id: "explore", no: "02", label: "국회탐험" },
  { id: "notebook", no: "03", label: "의원의 업무노트" },
]
export function Header({ view, go, trail }) {
  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-rule">
      <div className="max-w-[1240px] mx-auto px-5 flex items-center justify-between h-14 gap-4">
        <button
          onClick={() => go("home")}
          className="flex items-baseline gap-2 shrink-0"
          aria-label="정독 홈"
        >
          <span className="font-serif font-black text-[26px] leading-none tracking-tight">
            정독
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-mute tracking-widest">
            JEONGDOK
          </span>
        </button>
        <nav
          className="flex items-center overflow-x-auto"
          aria-label="주요 메뉴"
        >
          {TABS.map((t, i) => (
            <div key={t.id} className="flex items-center">
              {i > 0 && (
                <span className="text-rule px-0.5 sm:px-2" aria-hidden>
                  →
                </span>
              )}
              <button
                onClick={() => go(t.id)}
                aria-current={view === t.id ? "page" : undefined}
                className={`whitespace-nowrap px-2 sm:px-3 py-1.5 text-[13px] sm:text-sm font-medium rounded-sm transition-colors ${
                  view === t.id
                    ? "bg-pale text-brand"
                    : "text-ink hover:text-brand"
                }`}
              >
                <span className="hidden sm:inline font-mono text-[10px] mr-1.5 opacity-60">
                  {t.no}
                </span>
                {t.label}
              </button>
            </div>
          ))}
        </nav>
      </div>
      <div className="max-w-[1240px] mx-auto px-5 pb-2 text-[11px] text-mute">
        가상 데이터 미리보기 · 실제 의원 활동과 무관합니다
      </div>
      {trail && view !== "home" && (
        <div className="bg-pale/60 border-t border-rule">
          <div className="max-w-[1240px] mx-auto px-5 py-1.5 text-xs text-mute flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="font-mono text-[10px] text-brand">TRAIL</span>
            <button
              onClick={() => go("home")}
              className="hover:text-brand underline-offset-2 hover:underline"
            >
              오늘의 국회
            </button>
            <span>›</span>
            <button
              onClick={() => go("explore")}
              className="hover:text-brand underline-offset-2 hover:underline"
            >
              {trail}
            </button>
            {(view === "notebook" || view === "issue") && (
              <>
                <span>›</span>
                <span className="text-ink font-medium">
                  {view === "issue" ? "의제 상세" : "업무노트"}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-ink">
      <div className="max-w-[1240px] mx-auto px-5 py-8 grid md:grid-cols-[1fr_auto] gap-4 text-xs text-mute">
        <div>
          <p className="font-serif font-bold text-ink text-lg mb-1">
            정독 · 정치의 맥락을 읽다
          </p>
          <p>
            이 화면의 인물·법안·수치는 모두 디자인용 가상 예시이며 실제
            정치인·사건과 무관합니다.
          </p>
        </div>
        <p className="font-mono self-end">© 2026 JEONGDOK</p>
      </div>
    </footer>
  )
}
