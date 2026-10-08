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
