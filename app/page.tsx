'use client'

import { useCallback, useState } from 'react'
import TenisScene from '@/components/scene/TenisScene'
import Header from '@/components/ui/Header'
import ProductPanel from '@/components/ui/ProductPanel'
import MaskTuningPanel from '@/components/ui/MaskTuningPanel'
import HandModeToggle from '@/components/ui/HandModeToggle'
import HandStatusBadges from '@/components/ui/HandStatusBadges'
import CameraPreview from '@/components/ui/CameraPreview'
import VoiceToggle from '@/components/ui/VoiceToggle'
import VoiceListeningIndicator from '@/components/ui/VoiceListeningIndicator'
import VoiceCommandToast from '@/components/ui/VoiceCommandToast'
import { SHOE_COLORS } from '@/lib/colors'
import { useHandStore } from '@/lib/handStore'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'

export default function Home() {
  const [colorIndex, setColorIndex] = useState(0)

  const isVoiceEnabled = useHandStore((s) => s.isVoiceEnabled)
  const voicePermission = useHandStore((s) => s.voicePermission)

  const handleSelect = useCallback((index: number) => {
    setColorIndex(index)
  }, [])

  const applyColorByName = useCallback((name: string | null) => {
    if (name === null) {
      setColorIndex(0)
      return
    }
    const idx = SHOE_COLORS.findIndex((c) => c.name === name)
    if (idx >= 0) setColorIndex(idx)
  }, [])

  useVoiceRecognition({
    enabled: isVoiceEnabled && voicePermission !== 'denied' && voicePermission !== 'unsupported',
    onColorRecognized: applyColorByName,
  })

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
      <HandModeToggle />
      <VoiceToggle />
      <VoiceListeningIndicator />
      <HandStatusBadges />
      <CameraPreview />
      <VoiceCommandToast />
    </main>
  )
}

function SceneOverlay(props: { variantLabel: string }) {
  const { variantLabel } = props
  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)
  const isVoiceEnabled = useHandStore((s) => s.isVoiceEnabled)
  return (
    <>
      <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
        AR-1 · {variantLabel} · 360°
      </div>
      <div className="pointer-events-none absolute bottom-6 right-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
        {isVoiceEnabled ? (
          <span className="flex items-center gap-1.5">
            <MicIcon />
            Diga uma cor: preto · rosa · marrom · original
          </span>
        ) : isHandModeEnabled ? (
          <span className="flex items-center gap-1.5">
            <HandIcon />
            Mostre a palma. Gire a mão pra rotacionar
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <RotateIcon />
              Arraste
            </span>
            <span>·</span>
            <span>Role pra zoom</span>
          </>
        )}
      </div>
    </>
  )
}

function HandIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
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
