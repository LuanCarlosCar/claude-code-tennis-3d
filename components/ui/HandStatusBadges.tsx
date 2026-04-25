'use client'

import { useHandStore } from '@/lib/handStore'

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

function Badge(props: {
  active: boolean
  colorClass: string
  children: React.ReactNode
}) {
  const { active, colorClass, children } = props
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md transition-opacity duration-200 ${
        active
          ? 'border-white/20 bg-white/10 text-white'
          : 'border-white/10 bg-white/5 text-white/40'
      }`}
    >
      <span
        className={`block h-1.5 w-1.5 rounded-full ${
          active ? `${colorClass} animate-pulse shadow-[0_0_8px]` : 'bg-white/20'
        }`}
      />
      {children}
    </div>
  )
}
