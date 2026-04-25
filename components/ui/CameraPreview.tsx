'use client'

import { useRef } from 'react'
import { useHandStore } from '@/lib/handStore'
import { useCameraStream } from '@/hooks/useCameraStream'
import { useHandTracking } from '@/hooks/useHandTracking'

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)
  const cameraPermission = useHandStore((s) => s.cameraPermission)
  const isHandDetected = useHandStore((s) => s.isHandDetected)

  useCameraStream({ videoRef, enabled: isHandModeEnabled })
  useHandTracking({ videoRef, canvasRef, enabled: isHandModeEnabled })

  if (!isHandModeEnabled) return null

  const isReady = cameraPermission === 'granted'

  return (
    <div className="fixed bottom-6 right-6 z-30 w-55 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isHandDetected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'
          }`}
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
          câmera
        </span>
      </div>
      <div className="relative aspect-4/3">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ transform: 'scaleX(-1)' }}
          width={640}
          height={480}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-mono text-[10px] uppercase tracking-widest text-white/50">
            {cameraPermission === 'denied' ? 'permissão negada' : 'aguardando câmera…'}
          </div>
        )}
      </div>
    </div>
  )
}
