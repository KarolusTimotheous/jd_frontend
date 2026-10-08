import { test } from "node:test"
import assert from "node:assert/strict"
import { read, noteStorageKey } from "../src/features/notes/storage.js"
test("notes saved before migration keep their identity, draft and in-progress edit", () => {
  const key = "jeongdok-private-v1:person:22nd:HANZEEA"
  const note = {
    id: "existing-note",
    body: "기존에 작성한 내 메모",
    updated: "2026-10-08T06:00:00Z",
  }
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage")
  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (requested) =>
          requested === key
            ? JSON.stringify({
                notes: [note],
                draft: "수정 중인 생각",
                editingId: note.id,
              })
            : null,
      },
    })
    assert.equal(noteStorageKey("person:22nd:HANZEEA"), key)
    assert.deepEqual(read(key), {
      notes: [note],
      draft: "수정 중인 생각",
      editingId: note.id,
    })
    assert.equal(read(noteStorageKey("law:20230007")).notes.length, 0)
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: () => "{invalid" },
    })
    assert.deepEqual(read(key), { notes: [], draft: "", editingId: null })
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous)
    else Reflect.deleteProperty(globalThis, "localStorage")
  }
})
