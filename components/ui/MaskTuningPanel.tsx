'use client'

import { useEffect, useState } from 'react'
import { colorMaskUniforms } from '@/lib/colorMaskStore'

export default function MaskTuningPanel() {
  const [threshold, setThreshold] = useState(colorMaskUniforms.uThreshold.value)
  const [softness, setSoftness] = useState(colorMaskUniforms.uSoftness.value)
  const [accentThreshold, setAccentThreshold] = useState(
    colorMaskUniforms.uAccentThreshold.value,
  )
  const [accentSoftness, setAccentSoftness] = useState(
    colorMaskUniforms.uAccentSoftness.value,
  )
  const [open, setOpen] = useState(false)

  useEffect(() => {
    colorMaskUniforms.uThreshold.value = threshold
  }, [threshold])

  useEffect(() => {
    colorMaskUniforms.uSoftness.value = softness
  }, [softness])

  useEffect(() => {
    colorMaskUniforms.uAccentThreshold.value = accentThreshold
  }, [accentThreshold])

  useEffect(() => {
    colorMaskUniforms.uAccentSoftness.value = accentSoftness
  }, [accentSoftness])

  if (process.env.NODE_ENV !== 'development') return null

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-20 right-6 z-20 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-white/60 backdrop-blur-md hover:bg-white/10"
      >
        ⚙ tune mask
      </button>
    )
  }

  return (
    <div className="fixed top-20 right-6 z-20 w-64 rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-xs text-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/90 tracking-wide">MASK TUNING</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-white/40 hover:text-white/80"
          aria-label="Fechar painel"
        >
          ×
        </button>
      </div>

      <label className="block mb-3">
        <div className="flex justify-between text-[10px] text-white/60 mb-1">
          <span>threshold</span>
          <span>{threshold.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.02}
          max={0.6}
          step={0.005}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-white"
        />
      </label>

      <label className="block mb-2">
        <div className="flex justify-between text-[10px] text-white/60 mb-1">
          <span>softness</span>
          <span>{softness.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.005}
          max={0.3}
          step={0.005}
          value={softness}
          onChange={(e) => setSoftness(Number(e.target.value))}
          className="w-full accent-white"
        />
      </label>

      <div className="border-t border-white/10 pt-3 mt-2">
        <div className="text-[10px] text-white/60 mb-2 tracking-wide">ACCENT (parte bege/laranja)</div>

        <label className="block mb-3">
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>accent threshold</span>
            <span>{accentThreshold.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.7}
            step={0.005}
            value={accentThreshold}
            onChange={(e) => setAccentThreshold(Number(e.target.value))}
            className="w-full accent-white"
          />
        </label>

        <label className="block">
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>accent softness</span>
            <span>{accentSoftness.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.005}
            max={0.3}
            step={0.005}
            value={accentSoftness}
            onChange={(e) => setAccentSoftness(Number(e.target.value))}
            className="w-full accent-white"
          />
        </label>
      </div>

      <p className="text-[10px] text-white/40 leading-tight mt-3">
        body threshold: luminância máx. pra ser considerado &quot;corpo preto&quot;.<br />
        accent threshold: saturação mín. pra ser considerado &quot;detalhe colorido&quot;.
      </p>
    </div>
  )
}
