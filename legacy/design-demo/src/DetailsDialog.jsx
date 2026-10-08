import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
const Context = createContext(() => {})
export function DetailsProvider({ children }) {
  const [details, setDetails] = useState(null)
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    if (details && !ref.current?.open) ref.current?.showModal()
  }, [details])
  function close() {
    ref.current?.close()
    setDetails(null)
  }
  return (
    <Context.Provider value={setDetails}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClose={() => setDetails(null)}
        onClick={(event) => {
          if (event.target !== ref.current) return
          const r = ref.current.getBoundingClientRect()
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            close()
        }}
        className="detail-dialog bg-paper text-ink p-0"
      >
        {details && (
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start gap-5">
              <div>
                <p className="text-xs text-brand mb-2">가상 예시 · 자료 안내</p>
                <h2 id={titleId} className="font-serif font-bold text-2xl">
                  {details.title}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="자료 안내 닫기"
                className="shrink-0 w-10 h-10 border border-rule hover:bg-pale text-xl"
              >
                ×
              </button>
            </div>
            {(details.org || details.date) && (
              <p className="text-sm text-mute mt-3">
                {[details.org, details.date].filter(Boolean).join(" · ")}
              </p>
            )}
            {details.summary && (
              <p className="mt-6 leading-8">{details.summary}</p>
            )}
            {details.lines && (
              <ul className="mt-5 space-y-3 text-sm leading-7">
                {details.lines.map((line) => (
                  <li key={line} className="border-l-2 border-brand pl-3">
                    {line}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-6 pt-4 border-t border-rule text-sm text-mute leading-7">
              첨부 디자인의 가상 자료입니다. 실제 원문·공식 영상·의원 계정은
              아직 연결되지 않았습니다.
            </p>
          </div>
        )}
      </dialog>
    </Context.Provider>
  )
}
export function useDetails() {
  return useContext(Context)
}
export function SourceButton({ details, children, className = "" }) {
  const open = useDetails()
  return (
    <button
      type="button"
      onClick={() => open(details)}
      className={`text-brand underline underline-offset-4 text-left ${className}`}
    >
      {children}
    </button>
  )
}
