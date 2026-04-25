'use client'

import { SHOE_COLORS } from '@/lib/colors'
import { FEATURES } from './constants'
import Rating from './Rating'
import VariantSelector from './VariantSelector'
import SizeSelector from './SizeSelector'

type Props = {
  colorIndex: number
  onSelectVariant: (index: number) => void
}

export default function ProductPanel(props: Props) {
  const { colorIndex, onSelectVariant } = props
  const variant = SHOE_COLORS[colorIndex]

  return (
    <aside className="relative z-10 mx-auto flex h-full w-full max-w-140 flex-col justify-between gap-6 px-5 pt-8 pb-8 sm:px-8 lg:max-w-none lg:px-10 lg:pt-28">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-8 bg-white/30" />
          <span>Drop 01 · 2026 · Numerado</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
            Air Reasoning
            <span className="block font-mono text-xl font-normal tracking-wider text-white/60 mt-2 sm:text-2xl">
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Frete grátis BR</span>
        <span aria-hidden>·</span>
        <span>12 pares restantes</span>
        <span aria-hidden>·</span>
        <span>Drop 25/04</span>
      </div>
    </aside>
  )
}
