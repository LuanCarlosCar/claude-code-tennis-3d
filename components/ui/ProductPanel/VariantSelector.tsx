import { SHOE_COLORS } from '@/lib/colors'

type Props = {
  colorIndex: number
  onSelectVariant: (index: number) => void
}

export default function VariantSelector(props: Props) {
  const { colorIndex, onSelectVariant } = props
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        <span>Cor</span>
        <span className="text-white/30">{SHOE_COLORS[colorIndex].shortLabel}</span>
      </div>
      <div className="flex gap-2">
        {SHOE_COLORS.map((v, i) => {
          const isActive = i === colorIndex
          return (
            <button
              key={v.name}
              type="button"
              onClick={() => onSelectVariant(i)}
              aria-label={`Selecionar variante ${v.label}`}
              aria-pressed={isActive}
              className={`group relative flex flex-1 items-center gap-2.5 rounded-full border px-3 py-2 font-mono text-[11px] tracking-wide transition-all backdrop-blur-md ${
                isActive
                  ? 'border-white/40 bg-white/15 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span
                className="block h-4 w-4 rounded-full border border-white/20 shadow-inner"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${v.swatch.body} 0% 60%, ${v.swatch.accent} 60% 100%)`,
                }}
                aria-hidden
              />
              <span className="truncate">{v.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
