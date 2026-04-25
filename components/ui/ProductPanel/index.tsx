'use client'

import { SHOE_COLORS } from '@/lib/colors'

type Props = {
  colorIndex: number
  onSelectVariant: (index: number) => void
}

const SIZES = ['38', '39', '40', '41', '42', '43', '44']
const FEATURES = [
  'Cabedal PrimeKnit reciclado',
  'Solado contínuo de borracha',
  'Drop 8mm · 312g (tam 41)',
  'Numerado · Edição limitada',
]

export default function ProductPanel(props: Props) {
  const { colorIndex, onSelectVariant } = props
  const variant = SHOE_COLORS[colorIndex]

  return (
    <aside className="relative z-10 flex h-full flex-col justify-between px-10 pt-28 pb-8 max-w-[560px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-8 bg-white/30" />
          <span>Drop 01 · 2026 · Numerado</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-white xl:text-6xl">
            Air Reasoning
            <span className="block font-mono text-2xl font-normal tracking-wider text-white/60 mt-2">
              {variant.label}
            </span>
          </h1>
        </div>

        <Rating />

        <p className="max-w-md text-sm leading-relaxed text-white/70">
          Pensado pra quem joga pensando. Cabedal em malha técnica reciclada,
          entressola com espuma reativa de núcleo duplo e padrão de tração
          inspirado no padrão de execução do Claude Code. Cada par é numerado e
          assinado.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {FEATURES.map((feat) => (
            <span
              key={feat}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60 backdrop-blur-md"
            >
              {feat}
            </span>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-3xl font-semibold tracking-tight text-white">
              R$ 1.299
              <span className="text-white/50">,00</span>
            </span>
            <span className="font-mono text-[11px] text-white/40">
              ou 12× R$ 121,49
            </span>
          </div>
        </div>

        <VariantSelector
          colorIndex={colorIndex}
          onSelectVariant={onSelectVariant}
        />

        <SizeSelector />

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-white px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-neutral-950 transition-all hover:bg-white/90 active:scale-[0.99]"
          >
            <span className="relative z-10">Adicionar ao Carrinho</span>
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            Comprar Agora →
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Frete grátis BR</span>
        <span>·</span>
        <span>Apenas 12 pares restantes</span>
        <span>·</span>
        <span>Drop 25/04</span>
      </div>
    </aside>
  )
}

function Rating() {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-white/60">
      <div className="flex gap-0.5 text-amber-300">
        {[0, 1, 2, 3, 4].map((i) => (
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

function VariantSelector(props: Props) {
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

function SizeSelector() {
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
          const isSelected = size === '41'
          return (
            <button
              key={size}
              type="button"
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
