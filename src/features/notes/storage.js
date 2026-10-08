const blank = () => ({ draft: "", notes: [], editingId: null })
export function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null")
    if (!value || !Array.isArray(value.notes)) return blank()
    const notes = value.notes.filter(
      (n) =>
        typeof n.id === "string" &&
        typeof n.body === "string" &&
        typeof n.updated === "string",
    )
    return {
      draft: typeof value.draft === "string" ? value.draft : "",
      notes,
      editingId: notes.some((n) => n.id === value.editingId)
        ? value.editingId
        : null,
    }
  } catch {
    return blank()
  }
}
export const noteStorageKey = (subjectId) => "jeongdok-private-v1:" + subjectId
