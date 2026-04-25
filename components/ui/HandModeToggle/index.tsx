'use client'

import { useState } from 'react'
import { useHandStore } from '@/lib/handStore'
import CameraPermissionModal from '../CameraPermissionModal'

export default function HandModeToggle() {
  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)
  const cameraPermission = useHandStore((s) => s.cameraPermission)
  const toggleHandMode = useHandStore((s) => s.toggleHandMode)
  const setHandModeEnabled = useHandStore((s) => s.setHandModeEnabled)

  const [modalOpen, setModalOpen] = useState(false)

  function handleClick() {
    if (isHandModeEnabled) {
      toggleHandMode()
      return
    }
    if (cameraPermission === 'granted') {
      toggleHandMode()
      return
    }
    setModalOpen(true)
  }

  function handleConfirm() {
    setModalOpen(false)
    setHandModeEnabled(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isHandModeEnabled}
        aria-label={isHandModeEnabled ? 'Desativar hand mode' : 'Ativar hand mode'}
        className="fixed top-20 right-36 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-white/60 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
      >
        <span
          className={`block h-1.5 w-1.5 rounded-full ${
            isHandModeEnabled
              ? 'animate-pulse bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60'
              : 'bg-white/30'
          }`}
        />
        {isHandModeEnabled ? 'hand mode · ativo' : 'hand mode'}
      </button>

      <CameraPermissionModal
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
