'use client'

import { useEffect } from 'react'
import { useHandStore } from '@/lib/handStore'

const AUTO_DISMISS_MS = 1500

export default function VoiceCommandToast() {
  const lastRecognizedCommand = useHandStore((s) => s.lastRecognizedCommand)
  const setLastRecognizedCommand = useHandStore((s) => s.setLastRecognizedCommand)

  useEffect(() => {
    if (!lastRecognizedCommand) return
    const timer = setTimeout(() => {
      setLastRecognizedCommand(null)
    }, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [lastRecognizedCommand, setLastRecognizedCommand])

  if (!lastRecognizedCommand) return null

  const colorLabel = lastRecognizedCommand.color ?? 'original'

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-neutral-950/90 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur-md shadow-2xl">
      <span className="text-[9px] uppercase tracking-widest text-white/40">você disse</span>
      <span className="font-semibold text-white">{lastRecognizedCommand.word}</span>
      <span className="text-white/30">→</span>
      <span className="uppercase tracking-wider text-blue-300">{colorLabel}</span>
    </div>
  )
}
