'use client'

import { useHandStore } from '@/lib/handStore'
import Badge from './Badge'

export default function HandStatusBadges() {
  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)
  const isHandDetected = useHandStore((s) => s.isHandDetected)
  const isGripping = useHandStore((s) => s.isGripping)

  if (!isHandModeEnabled) return null

  return (
    <div className="pointer-events-none fixed top-24 left-1/2 z-30 flex -translate-x-1/2 gap-2">
      <Badge active={isHandDetected} colorClass="bg-emerald-400 shadow-emerald-400/60">
        MÃO DETECTADA
      </Badge>
      <Badge active={isGripping} colorClass="bg-[#d4763c] shadow-[#d4763c]/60">
        GRIP
      </Badge>
    </div>
  )
}
