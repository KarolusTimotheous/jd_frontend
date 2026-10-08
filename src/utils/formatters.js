export function timeLabel(iso) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
export function termLabel(person) {
  const term = person.id.match(/^(\d+)/)?.[1]
  return term ? `제${term}대 발의 기록` : "공식 발의 기록"
}
