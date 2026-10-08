import { usePrivateNotes } from "../hooks/usePrivateNotes"
export default function PrivateNotes({ subjectId, subjectName }) {
  const {
    book,
    editing,
    message,
    undo,
    setMessage,
    setUndo,
    save,
    submit,
    download,
  } = usePrivateNotes(subjectId, subjectName)
  return (
    <section className="scratchpad" aria-label={`${subjectName} 개인 낙서장`}>
      <div className="flex flex-wrap justify-between gap-3 mb-5">
        <div>
          <p className="eyebrow">MY MARGIN NOTES</p>
          <h3 className="font-serif text-2xl font-bold mt-1">
            생각을 남기는 여백
          </h3>
        </div>
        <span className="self-start text-xs border border-brand/30 rounded-full px-3 py-1 text-brand">
          나만의 낙서장
        </span>
      </div>
      <p className="text-sm text-mute mb-5">
        {subjectName}에 대한 내 생각. 이 브라우저에만 저장되며, 의원에게
        전송되거나 공개되지 않아요. 브라우저 데이터를 지우면 사라져요.
      </p>
      <label className="text-sm font-bold block mb-2" htmlFor="private-note">
        {editing ? "노트 수정" : "새로운 생각"}
      </label>
      <textarea
        id="private-note"
        className="note-paper w-full p-4 border border-rule rounded-sm min-h-40 resize-y"
        maxLength={6000}
        value={book.draft}
        onChange={(e) =>
          save(
            { ...book, draft: e.target.value },
            "작성 중인 내용도 임시 저장돼요.",
          )
        }
        placeholder="읽으며 떠오른 질문, 동의한 부분, 다음에 확인할 것…"
      />
      <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
        <span className="text-xs text-mute">
          {book.draft.length.toLocaleString()} / 6,000
        </span>
        <div className="flex gap-3">
          {editing && (
            <button
              className="text-sm text-mute"
              onClick={() =>
                save(
                  { ...book, editingId: null, draft: "" },
                  "수정을 취소했어요.",
                )
              }
            >
              수정 취소
            </button>
          )}
          <button
            className="primary-button"
            disabled={!book.draft.trim()}
            onClick={submit}
          >
            {editing ? "수정 저장" : "내 노트 저장"} <span aria-hidden>↗</span>
          </button>
        </div>
      </div>
      <p role="status" className="text-xs text-brand mt-3 min-h-5">
        {message}
      </p>
      {undo && (
        <p className="text-sm bg-white p-3 border border-rule mt-3">
          노트를 삭제했어요.{" "}
          <button
            className="underline text-brand ml-2"
            onClick={() => {
              save(
                { ...book, notes: [undo, ...book.notes] },
                "노트를 복원했어요.",
              )
              setUndo(null)
            }}
          >
            되돌리기
          </button>
        </p>
      )}
      <div className="mt-7 border-t border-brand/20 pt-5">
        <div className="flex justify-between gap-3">
          <h4 className="font-bold text-sm">
            내가 남긴 노트{" "}
            <span className="text-brand">{book.notes.length}</span>
          </h4>
          <button
            className="text-xs underline disabled:opacity-40"
            disabled={!book.notes.length && !book.draft}
            onClick={download}
          >
            내 노트 내려받기
          </button>
        </div>
        {!book.notes.length && (
          <p className="text-sm text-mute py-6">
            아직 비어 있는 여백이에요. 첫 생각을 남겨보세요.
          </p>
        )}
        {book.notes.map((note) => (
          <article
            key={note.id}
            className="bg-paper border border-rule p-5 mt-4"
          >
            <time className="text-[11px] text-mute">
              {new Date(note.updated).toLocaleString("ko-KR")}
            </time>
            <p className="whitespace-pre-wrap leading-8 text-sm my-3">
              {note.body}
            </p>
            <div className="flex gap-4 text-xs text-mute">
              <button
                onClick={() => {
                  if (book.draft.trim()) {
                    setMessage(
                      "작성 중인 내용을 먼저 저장하거나 수정을 취소해 주세요.",
                    )
                    return
                  }
                  save(
                    { ...book, editingId: note.id, draft: note.body },
                    "노트를 수정하고 있어요.",
                  )
                  document.getElementById("private-note")?.focus()
                }}
              >
                수정
              </button>
              <button
                onClick={() => {
                  setUndo(note)
                  save(
                    {
                      editingId: editing === note.id ? null : editing,
                      draft: editing === note.id ? "" : book.draft,
                      notes: book.notes.filter((n) => n.id !== note.id),
                    },
                    "노트를 삭제했어요.",
                  )
                }}
              >
                삭제
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
