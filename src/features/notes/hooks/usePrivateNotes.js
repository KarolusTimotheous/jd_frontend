import { useEffect, useState } from "react"
import { read, noteStorageKey } from "../storage"
export function usePrivateNotes(subjectId, subjectName) {
  const key = noteStorageKey(subjectId)
  const [book, setBook] = useState(() => read(key))
  const editing = book.editingId
  const [message, setMessage] = useState("")
  const [undo, setUndo] = useState(null)
  useEffect(() => {
    setBook(read(key))
    setMessage("")
    setUndo(null)
  }, [key])
  function save(next, success) {
    setBook(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
      setMessage(success)
    } catch {
      setMessage(
        "브라우저 저장 공간을 사용할 수 없어요. 아래 ‘내 노트 내려받기’로 보관해 주세요.",
      )
    }
  }
  function submit() {
    const body = book.draft.trim()
    if (!body) return
    const note = {
      id: editing || crypto.randomUUID(),
      body,
      updated: new Date().toISOString(),
    }
    save(
      {
        draft: "",
        editingId: null,
        notes: editing
          ? book.notes.map((n) => (n.id === editing ? note : n))
          : [note, ...book.notes],
      },
      "이 브라우저에 저장했어요.",
    )
  }
  function download() {
    const text =
      `${subjectName} · 나의 정독 노트\n\n` +
      book.notes.map((n) => `${n.updated}\n${n.body}`).join("\n\n---\n\n") +
      (book.draft ? `\n\n작성 중\n${book.draft}` : "")
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    )
    const a = document.createElement("a")
    a.href = url
    a.download = `정독-${subjectName}-내노트.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  return {
    book,
    editing,
    message,
    undo,
    setMessage,
    setUndo,
    save,
    submit,
    download,
  }
}
