import { useEffect, RefObject } from 'react'
import { useHandStore } from '@/lib/handStore'

interface UseCameraStreamProps {
  videoRef: RefObject<HTMLVideoElement | null>
  enabled: boolean
}

export function useCameraStream(props: UseCameraStreamProps) {
  const { videoRef, enabled } = props
  const setCameraPermission = useHandStore((s) => s.setCameraPermission)

  useEffect(() => {
    if (!enabled) return

    let stream: MediaStream | null = null
    let cancelled = false

    async function start() {
      try {
        setCameraPermission('requesting')
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          stream = null
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraPermission('granted')
      } catch (err) {
        console.error('[camera] getUserMedia failed:', err)
        setCameraPermission('denied')
      }
    }

    start()

    return () => {
      cancelled = true
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [enabled, videoRef, setCameraPermission])
}
