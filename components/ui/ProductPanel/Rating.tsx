const STARS = [0, 1, 2, 3, 4]

export default function Rating() {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-white/60">
      <div className="flex gap-0.5 text-amber-300">
        {STARS.map((i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="text-white/80">4.8</span>
      <span className="text-white/40">·</span>
      <span>1.247 avaliações</span>
    </div>
  )
}
