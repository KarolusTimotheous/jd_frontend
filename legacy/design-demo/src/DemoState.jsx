import { createContext, useContext, useState } from "react"
const KEY = "jeongdok-demo-v1"
const initial = {
  vote: null,
  comments: [
    {
      id: "sample-1",
      who: "시민 3721 · 예시",
      text: "보증금 상한을 올리면 정말 사각지대가 줄어드는지 근거 자료가 궁금합니다.",
    },
    {
      id: "sample-2",
      who: "시민 1088 · 예시",
      text: "예방 중심 C안이 먼저 아닐까요? 구제는 어차피 사후 대책이라서요.",
    },
  ],
  questions: {
    l1: [
      {
        id: "sample-q1",
        text: "A안의 보증금 상한 7억 원은 어떤 통계를 근거로 정해졌나요?",
        author: "의원실",
        answer:
          "비용추계서에 근거 통계를 공개하고, 지원 대상에 대한 추가 검토 결과를 안내하겠습니다. (가상 답변)",
        bill: "b1",
      },
      {
        id: "sample-q2",
        text: "피해자 인정 기준에서 빠지는 사례는 구체적으로 어떤 경우인가요?",
        bill: "b1",
      },
    ],
  },
  drafts: {},
}
function load() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null")
    if (
      !value ||
      !Array.isArray(value.comments) ||
      typeof value.questions !== "object" ||
      !value.questions ||
      Array.isArray(value.questions)
    )
      return initial
    const questions = {}
    for (const [id, items] of Object.entries(value.questions)) {
      if (!/^l[1-4]$/.test(id) || !Array.isArray(items)) continue
      questions[id] = items
        .filter(
          (q) =>
            q &&
            typeof q.id === "string" &&
            typeof q.text === "string" &&
            q.text.length <= 2000 &&
            (!q.answer || typeof q.answer === "string"),
        )
        .slice(0, 100)
    }
    const drafts = {}
    for (const [id, text] of Object.entries(value.drafts || {}))
      if (typeof text === "string") drafts[id] = text.slice(0, 2000)
    return {
      vote: [0, 1, 2].includes(value.vote) ? value.vote : null,
      comments: value.comments
        .filter(
          (c) =>
            c &&
            typeof c.id === "string" &&
            typeof c.who === "string" &&
            typeof c.text === "string",
        )
        .slice(0, 100),
      questions,
      drafts,
    }
  } catch {
    return initial
  }
}
const Context = createContext(null)
export function DemoStateProvider({ children }) {
  const [state, setState] = useState(load)
  const [storageOK, setStorageOK] = useState(true)
  function update(fn) {
    const next = fn(state)
    setState(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      setStorageOK(false)
    }
  }
  return (
    <Context.Provider value={{ state, update, storageOK }}>
      {children}
    </Context.Provider>
  )
}
export function useDemo() {
  const value = useContext(Context)
  if (!value) throw new Error("DemoStateProvider is required")
  return value
}
export function LocalNotice() {
  const { storageOK } = useDemo()
  return (
    <p className="text-xs text-mute mt-3">
      {storageOK
        ? "입력 내용은 이 브라우저에만 저장되며 의원에게 전송되지 않습니다."
        : "브라우저 저장 공간을 사용할 수 없어 새로고침하면 입력이 사라집니다. 의원에게 전송되지 않습니다."}
    </p>
  )
}
