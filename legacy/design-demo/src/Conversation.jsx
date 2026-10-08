import { useState } from "react"
import { LAWMAKERS } from "./data"
import { LocalNotice, useDemo } from "./DemoState"
export function CitizenDiscussion() {
  const { state, update } = useDemo()
  const [notice, setNotice] = useState("")
  const draft = state.drafts.comment || ""
  return (
    <>
      <ul className="space-y-3 border-t border-rule pt-4">
        {state.comments.map((c) => (
          <li key={c.id} className="text-sm leading-7 break-words">
            <span className="text-xs text-mute mr-2">{c.who}</span>
            {c.text}
            {c.who === "나 · 이 브라우저" && (
              <button
                aria-label="내 의견 삭제"
                onClick={() =>
                  update((s) => ({
                    ...s,
                    comments: s.comments.filter((item) => item.id !== c.id),
                  }))
                }
                className="text-xs text-mute underline ml-2"
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          update((s) => ({
            ...s,
            comments: [
              {
                id: crypto.randomUUID(),
                who: "나 · 이 브라우저",
                text: draft.trim(),
              },
              ...s.comments,
            ].slice(0, 100),
            drafts: { ...s.drafts, comment: "" },
          }))
          setNotice("의견이 이 브라우저에 저장됐어요.")
        }}
      >
        <input
          aria-label="시민 토론 의견"
          maxLength={1000}
          required
          value={draft}
          onChange={(e) =>
            update((s) => ({
              ...s,
              drafts: { ...s.drafts, comment: e.target.value },
            }))
          }
          placeholder="의견을 남겨보세요"
          className="flex-1 min-w-0 border border-rule px-3 py-2 text-sm bg-paper"
        />
        <button
          disabled={!draft.trim()}
          className="bg-ink text-white text-sm px-4 hover:bg-brand disabled:opacity-40"
        >
          등록
        </button>
      </form>
      <LocalNotice />
      <p className="text-xs text-brand mt-2" role="status">
        {notice}
      </p>
    </>
  )
}
export function LawmakerQuestions({ id, bill }) {
  const { state, update } = useDemo()
  const [notice, setNotice] = useState("")
  const draftKey = `question-${id}`
  const draft = state.drafts[draftKey] || ""
  const questions = state.questions[id] || []
  return (
    <>
      <ul className="space-y-5">
        {questions.length === 0 && (
          <li className="text-sm text-mute">
            아직 등록된 질문이 없어요. 이 의원의 활동에서 궁금한 점을
            남겨보세요.
          </li>
        )}
        {questions.map((q) => (
          <li
            key={q.id}
            className="border-b border-rule pb-4 last:border-0 break-words"
          >
            <p className="font-medium leading-7">Q. {q.text}</p>
            {q.local && (
              <button
                aria-label="내 질문 삭제"
                onClick={() =>
                  update((s) => ({
                    ...s,
                    questions: {
                      ...s.questions,
                      [id]: (s.questions[id] || []).filter(
                        (item) => item.id !== q.id,
                      ),
                    },
                  }))
                }
                className="text-xs text-mute underline mt-2"
              >
                내 질문 삭제
              </button>
            )}
            {q.answer ? (
              <div className="mt-3 pl-4 border-l-2 border-brand">
                <span className="text-xs bg-pale text-brand px-2 py-1">
                  {q.author} · 가상 답변
                </span>
                <p className="text-sm leading-7 mt-2">{q.answer}</p>
                <p className="text-xs text-mute mt-2">
                  후속 조치 · 추가 자료 공개 여부 확인 전
                </p>
              </div>
            ) : (
              <p className="text-xs text-mute mt-2">
                {q.local
                  ? "내 질문 · 이 브라우저에 저장됨 · 미전송"
                  : "답변 없음 · 가상 예시"}
              </p>
            )}
          </li>
        ))}
      </ul>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          update((s) => ({
            ...s,
            questions: {
              ...s.questions,
              [id]: [
                {
                  id: crypto.randomUUID(),
                  text: draft.trim(),
                  local: true,
                  bill,
                },
                ...(s.questions[id] || []),
              ].slice(0, 100),
            },
            drafts: { ...s.drafts, [draftKey]: "" },
          }))
          setNotice(
            "질문을 이 브라우저에 저장했어요. 의원에게 전송되지는 않았어요.",
          )
        }}
      >
        <label
          htmlFor={`question-${id}`}
          className="text-sm font-medium block mb-2"
        >
          {LAWMAKERS[id]?.name || "선택한"} 의원에게 질문하기
        </label>
        <textarea
          id={`question-${id}`}
          required
          maxLength={2000}
          value={draft}
          onChange={(e) =>
            update((s) => ({
              ...s,
              drafts: { ...s.drafts, [draftKey]: e.target.value },
            }))
          }
          placeholder="법안의 적용 대상이나 후속 조치에 대해 질문해보세요."
          rows={3}
          className="w-full border border-rule px-3 py-2 text-sm bg-paper resize-y"
        />
        <div className="flex items-center justify-between gap-4 mt-2">
          <span className="text-xs text-mute">{draft.length}/2,000</span>
          <button
            disabled={!draft.trim()}
            className="bg-brand text-white text-sm px-5 py-2.5 hover:bg-brand-dark disabled:opacity-40"
          >
            질문 저장
          </button>
        </div>
        <LocalNotice />
        <p role="status" className="text-sm text-brand mt-2">
          {notice}
        </p>
      </form>
    </>
  )
}
