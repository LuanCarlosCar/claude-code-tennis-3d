'use client'

import { SHOE_COLORS } from '@/lib/colors'

type Props = {
  colorIndex: number
  onCycle: () => void
}

export default function ColorCyclerButton(props: Props) {
  const { colorIndex, onCycle } = props
  const current = SHOE_COLORS[colorIndex]
  const next = SHOE_COLORS[(colorIndex + 1) % SHOE_COLORS.length]

  const swatchStyle = current.value
    ? { backgroundColor: current.value }
    : {
        backgroundImage:
          'conic-gradient(from 180deg, #D4763C, #1a1a1a, #C8102E, #1B4332, #1E3A8A, #D4763C)',
      }

  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`Trocar cor do tênis. Próxima: ${next.label}`}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-sm text-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
    >
      <span
        className="h-4 w-4 rounded-full border border-white/20 shadow-inner"
        style={swatchStyle}
        aria-hidden
      />
      <span className="tracking-wide">{current.label}</span>
      <span className="text-white/40">·</span>
      <span className="text-white/50 text-xs">próxima: {next.label}</span>
    </button>
  )
}
