import { useState } from "react"
export function Img({ src, alt, className = "" }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`bg-[#2c2a3d] overflow-hidden ${className}`}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          onError={() => setOk(false)}
          className="w-full h-full object-cover"
          decoding="async"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full min-h-32 grid place-items-center text-white/80 text-sm p-6 text-center"
        >
          이미지를 불러올 수 없습니다
        </div>
      )}
    </div>
  )
}
