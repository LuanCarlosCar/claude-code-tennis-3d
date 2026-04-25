import { useEffect, RefObject, useRef } from 'react'
import { useHandStore } from '@/lib/handStore'

interface UseCameraStreamProps {
  videoRef: RefObject<HTMLVideoElement | null>
  enabled: boolean
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: { width: 640, height: 480, facingMode: 'user' },
  audio: false,
}

export function useCameraStream(props: UseCameraStreamProps) {
  const { videoRef, enabled } = props
  const setCameraPermission = useHandStore((s) => s.setCameraPermission)

  const streamRef = useRef<MediaStream | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    cancelledRef.current = false
    startStream()
    return stopStream


  }, [enabled, videoRef])

  async function startStream() {
    try {
      setCameraPermission('requesting')
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS)
      if (cancelledRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraPermission('granted')
    } catch (err) {
      console.error('[camera] getUserMedia failed:', err)
      setCameraPermission('denied')
    }
  }

  function stopStream() {
    cancelledRef.current = true
    const stream = streamRef.current
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }
}
