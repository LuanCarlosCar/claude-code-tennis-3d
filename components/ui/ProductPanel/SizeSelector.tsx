import { useState } from 'react'
import { DEFAULT_SIZE, SIZES } from './constants'

export default function SizeSelector() {
  const [selected, setSelected] = useState<string>(DEFAULT_SIZE)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        <span>Tamanho · BR</span>
        <a href="#" className="text-white/40 hover:text-white">
          Guia →
        </a>
      </div>
      <div className="flex gap-1.5">
        {SIZES.map((size) => {
          const isSelected = size === selected
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSelected(size)}
              aria-pressed={isSelected}
              className={`flex-1 rounded-md border px-2 py-2 font-mono text-xs transition-all ${
                isSelected
                  ? 'border-white/40 bg-white text-neutral-950'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'
              }`}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
