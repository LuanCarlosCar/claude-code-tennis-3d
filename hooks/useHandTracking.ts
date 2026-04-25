import { useEffect, RefObject, useRef } from 'react'
import * as THREE from 'three'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { useHandStore } from '@/lib/handStore'
import {
  HAND_CONNECTIONS,
  Landmark,
  computeHandQuaternion,
  mirrorLandmarks,
} from '@/lib/handGeometry'

interface UseHandTrackingProps {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  enabled: boolean
}

const TARGET_INTERVAL_MS = 33
const SUNSET = '#D4763C'

// Offset fixo aplicado no frame local do tênis ANTES da rotação da mão.
// Alinha o "topo do tênis" (Y local) com a normal da palma (Z no frame da mão),
// fazendo a sola "encostar" na palma. Ajuste fino se a orientação parecer torta.
const SHOE_GRIP_OFFSET = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, 0),
)

const VISION_TASKS_WASM =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
const HAND_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export function useHandTracking(props: UseHandTrackingProps) {
  const { videoRef, canvasRef, enabled } = props

  const armedRef = useRef(false)
  const grippingRef = useRef(false)
  const lastInferRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function init() {
      try {
        const fileset = await FilesetResolver.forVisionTasks(VISION_TASKS_WASM)
        if (cancelled) return
        const landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: HAND_LANDMARKER_MODEL,
            delegate: 'GPU',
          },
          numHands: 1,
          runningMode: 'VIDEO',
        })
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        loop()
      } catch (err) {
        console.error('[hand-tracking] init failed:', err)
      }
    }

    function resetState() {
      const store = useHandStore.getState()
      store.setHandDetected(false)
      store.setArmed(false)
      store.setGripping(false)
      armedRef.current = false
      grippingRef.current = false
    }

    function processFrame(landmarksRaw: Landmark[]) {
      const landmarks = mirrorLandmarks(landmarksRaw)
      const handQuat = computeHandQuaternion(landmarks)
      const store = useHandStore.getState()

      // Mão detectada = grip ativo. Não exige curvar dedos.
      grippingRef.current = true
      armedRef.current = true

      const target = handQuat.clone().multiply(SHOE_GRIP_OFFSET)
      store.setTargetQuaternion([target.x, target.y, target.z, target.w])

      store.setHandDetected(true)
      store.setArmed(true)
      store.setGripping(true)

      drawSkeleton(landmarksRaw, true)
    }

    function drawSkeleton(landmarks: Landmark[], gripping: boolean) {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const color = gripping ? SUNSET : '#ffffff'
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 2

      for (const [a, b] of HAND_CONNECTIONS) {
        const la = landmarks[a]
        const lb = landmarks[b]
        ctx.beginPath()
        ctx.moveTo(la.x * w, la.y * h)
        ctx.lineTo(lb.x * w, lb.y * h)
        ctx.stroke()
      }
      for (const l of landmarks) {
        ctx.beginPath()
        ctx.arc(l.x * w, l.y * h, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function clearCanvas() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function loop() {
      if (cancelled) return
      rafRef.current = requestAnimationFrame(loop)

      const now = performance.now()
      if (now - lastInferRef.current < TARGET_INTERVAL_MS) return
      lastInferRef.current = now

      const video = videoRef.current
      const landmarker = landmarkerRef.current
      if (!video || !landmarker) return
      if (video.readyState < 2) return

      let result
      try {
        result = landmarker.detectForVideo(video, now)
      } catch (err) {
        console.error('[hand-tracking] detect failed:', err)
        return
      }

      if (!result.landmarks || result.landmarks.length === 0) {
        resetState()
        clearCanvas()
        return
      }

      processFrame(result.landmarks[0] as Landmark[])
    }

    init()

    return () => {
      cancelled = true
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close()
        landmarkerRef.current = null
      }
      resetState()
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      const store = useHandStore.getState()
      store.setTargetQuaternion(null)
    }
  }, [enabled, videoRef, canvasRef])
}
