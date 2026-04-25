'use client'

import { useProgress } from '@react-three/drei'

export default function LoadingState() {
  const { active, progress } = useProgress()
  if (!active && progress >= 100) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-neutral-950">
      <p className="font-mono text-sm tracking-wide text-white/80 animate-pulse">
        Renderizando o tênis...
      </p>
      <p className="font-mono text-xs text-white/40">
        Carregando geometria · Compactação Draco · ~3MB · {Math.round(progress)}%
      </p>
    </div>
  )
}
