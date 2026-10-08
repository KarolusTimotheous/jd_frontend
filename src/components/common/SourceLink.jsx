export function SourceLink({ url, children }) {
  return (
    <a className="source-link" href={url} target="_blank" rel="noreferrer">
      {children} <span aria-hidden>↗</span>
    </a>
  )
}
