'use client'

import { useHandStore } from '@/lib/handStore'
import { DragHint, HandHint, VoiceHint } from './hints'

type Props = {
  variantLabel: string
}

export default function SceneOverlay(props: Props) {
  const { variantLabel } = props
  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)
  const isVoiceEnabled = useHandStore((s) => s.isVoiceEnabled)

  return (
    <>
      <div className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 sm:right-8 lg:block">
        AR-1 · {variantLabel} · 360°
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/40 sm:bottom-6 sm:right-8 sm:gap-3 sm:text-[10px]">
        {renderActiveHint(isVoiceEnabled, isHandModeEnabled)}
      </div>
    </>
  )
}

function renderActiveHint(isVoiceEnabled: boolean, isHandModeEnabled: boolean) {
  if (isVoiceEnabled) return <VoiceHint />
  if (isHandModeEnabled) return <HandHint />
  return <DragHint />
}
