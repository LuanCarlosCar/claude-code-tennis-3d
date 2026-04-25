'use client'

import { useCallback, useState } from 'react'
import TenisScene from '@/components/scene/TenisScene'
import Header from '@/components/ui/Header'
import ProductPanel from '@/components/ui/ProductPanel'
import MaskTuningPanel from '@/components/ui/MaskTuningPanel'
import { SHOE_COLORS } from '@/lib/colors'

export default function Home() {
  const [colorIndex, setColorIndex] = useState(0)

  const handleSelect = useCallback((index: number) => {
    setColorIndex(index)
  }, [])

  const current = SHOE_COLORS[colorIndex]

  return (
    <main className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 lg:h-screen lg:overflow-hidden">
      {SHOE_COLORS.map((variant, i) => (
        <div
          key={variant.name}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ background: variant.bg, opacity: i === colorIndex ? 1 : 0 }}
        />
      ))}

      <NoiseOverlay />

      <Header />

      <div className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(360px,42%)_1fr]">
        <div className="order-2 lg:order-1">
          <ProductPanel
            colorIndex={colorIndex}
            onSelectVariant={handleSelect}
          />
        </div>

        <div className="relative order-1 h-[70vh] min-h-120 lg:order-2 lg:h-full">
          <TenisScene
            bodyColor={current.body}
            accentColor={current.accent}
          />
          <SceneOverlay variantLabel={current.label} />
        </div>
      </div>

      <MaskTuningPanel />
    </main>
  )
}

function SceneOverlay(props: { variantLabel: string }) {
  const { variantLabel } = props
  return (
    <>
      <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
        AR-1 · {variantLabel} · 360°
      </div>
      <div className="pointer-events-none absolute bottom-6 right-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span className="flex items-center gap-1.5">
          <RotateIcon />
          Arraste
        </span>
        <span>·</span>
        <span>Role pra zoom</span>
      </div>
    </>
  )
}

function RotateIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3.5-7.13" />
      <path d="M21 4v5h-5" />
    </svg>
  )
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  )
}
