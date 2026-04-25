'use client'

import { useEffect, useState } from 'react'
import { useHandStore } from '@/lib/handStore'
import VoicePermissionModal from './VoicePermissionModal'

export default function VoiceToggle() {
  const isVoiceEnabled = useHandStore((s) => s.isVoiceEnabled)
  const voicePermission = useHandStore((s) => s.voicePermission)
  const isListening = useHandStore((s) => s.isListening)
  const toggleVoice = useHandStore((s) => s.toggleVoice)
  const setVoiceEnabled = useHandStore((s) => s.setVoiceEnabled)
  const setVoicePermission = useHandStore((s) => s.setVoicePermission)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (voicePermission !== 'idle') return
    const win = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }
    const supported = 'SpeechRecognition' in win || 'webkitSpeechRecognition' in win
    if (!supported) setVoicePermission('unsupported')
  }, [voicePermission, setVoicePermission])

  const isUnsupported = voicePermission === 'unsupported'

  function handleClick() {
    if (isUnsupported) return
    if (isVoiceEnabled) {
      toggleVoice()
      return
    }
    if (voicePermission === 'granted') {
      toggleVoice()
      return
    }
    setModalOpen(true)
  }

  function handleConfirm() {
    setModalOpen(false)
    setVoiceEnabled(true)
  }

  const label = isVoiceEnabled ? 'voice · ativo' : 'voice'

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isUnsupported}
        aria-pressed={isVoiceEnabled}
        aria-label={isVoiceEnabled ? 'Desativar voice mode' : 'Ativar voice mode'}
        title={isUnsupported ? 'Voz funciona melhor em Chrome ou Edge' : undefined}
        className="fixed top-20 right-76 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-white/60 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:text-white/60"
      >
        <span
          className={`block h-1.5 w-1.5 rounded-full ${
            isVoiceEnabled && isListening
              ? 'animate-pulse bg-blue-400 shadow-[0_0_8px] shadow-blue-400/60'
              : isVoiceEnabled
                ? 'bg-blue-400/70'
                : 'bg-white/30'
          }`}
        />
        {label}
      </button>

      <VoicePermissionModal
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
