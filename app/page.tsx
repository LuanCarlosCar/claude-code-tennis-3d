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
import NoiseOverlay from '@/components/ui/NoiseOverlay'
import SceneOverlay from '@/components/ui/SceneOverlay'
import { SHOE_COLORS } from '@/lib/colors'
import { useHandStore } from '@/lib/handStore'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { findColorIndexByName } from './utils'

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
    const idx = findColorIndexByName(name)
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

      <div className="relative z-10 grid w-full grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(360px,42%)_1fr]">
        <div className="relative order-1 h-[55vh] min-h-90 w-full touch-pan-y lg:order-2 lg:h-full lg:touch-none">
          <TenisScene
            bodyColor={current.body}
            accentColor={current.accent}
          />
          <SceneOverlay variantLabel={current.label} />
        </div>

        <div className="order-2 lg:order-1">
          <ProductPanel
            colorIndex={colorIndex}
            onSelectVariant={handleSelect}
          />
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
