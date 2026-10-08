export function SectionHead({ no, title, desc }) {
  return (
    <div className="rule-top pt-3 mb-6 flex items-baseline gap-3 flex-wrap">
      <span className="font-mono text-xs text-brand">{no}</span>
      <h2 className="font-serif font-bold text-2xl">{title}</h2>
      {desc && (
        <p className="text-sm text-mute w-full md:w-auto md:ml-2">{desc}</p>
      )}
    </div>
  )
}
