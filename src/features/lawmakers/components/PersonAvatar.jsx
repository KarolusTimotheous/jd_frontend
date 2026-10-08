import { useState } from "react"
import { Initial } from "../../../components/common/Initial"
export function PersonAvatar({ person, large = false }) {
  const [failed, setFailed] = useState(false)
  return person.image && !failed ? (
    <img
      className={`person-photo ${large ? "large" : ""}`}
      src={person.image}
      alt={`${person.name} 의원`}
      onError={() => setFailed(true)}
    />
  ) : (
    <Initial name={person.name} size={large ? 90 : 48} />
  )
}
