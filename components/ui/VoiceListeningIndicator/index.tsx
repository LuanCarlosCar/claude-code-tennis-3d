'use client'

import { useHandStore } from '@/lib/handStore'

export default function VoiceListeningIndicator() {
  const isVoiceEnabled = useHandStore((s) => s.isVoiceEnabled)
  const isListening = useHandStore((s) => s.isListening)

  if (!isVoiceEnabled || !isListening) return null

  return (
    <div className="pointer-events-none fixed top-32 right-6 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/55">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
      </span>
      ouvindo
    </div>
  )
}
