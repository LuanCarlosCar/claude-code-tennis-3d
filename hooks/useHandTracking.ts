import { useEffect, RefObject, useRef } from 'react'
import * as THREE from 'three'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { useHandStore } from '@/lib/handStore'
import {
  HAND_CONNECTIONS,
  Landmark,
  computeHandQuaternion,
  computePalmConfidence,
} from '@/lib/handGeometry'

interface UseHandTrackingProps {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  enabled: boolean
}

const TARGET_INTERVAL_MS = 33
const SUNSET = '#D4763C'

// Estabilização: descarta frames onde a base da palma está mal condicionada (edge-on)
// ou onde o quaternion deu salto angular grande (provável flip espúrio do MediaPipe).
const PALM_CONFIDENCE_MIN = 0.4
const MAX_FRAME_DELTA_RAD = Math.PI / 6 // 30°

// Offset fixo aplicado no frame local do tênis ANTES da rotação da mão.
// Alinha o eixo Y local (topo do cano) com a normal da palma INVERTIDA, fazendo
// a SOLA encostar na palma e o cano apontar pra fora. Se inverter o sinal,
// o tênis vira de cabeça pra baixo (topo na mão).
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
  const lastHandQuatRef = useRef<THREE.Quaternion | null>(null)

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

    function processFrame(imageLandmarks: Landmark[], worldLandmarks: Landmark[]) {
      const store = useHandStore.getState()

      // Mão presente — sempre marca detected/grip; rotação só é atualizada
      // se o frame passar nos gates de qualidade abaixo.
      grippingRef.current = true
      armedRef.current = true
      store.setHandDetected(true)
      store.setArmed(true)
      store.setGripping(true)
      drawSkeleton(imageLandmarks, true)

      // Gate 1: palma muito edge-on → base mal condicionada, descarta frame.
      const palmConfidence = computePalmConfidence(worldLandmarks)
      if (palmConfidence < PALM_CONFIDENCE_MIN) return

      const handQuat = computeHandQuaternion(worldLandmarks)

      // Continuidade de hemisfério: evita slerp pelo "long path".
      const last = lastHandQuatRef.current
      if (last && handQuat.dot(last) < 0) {
        handQuat.set(-handQuat.x, -handQuat.y, -handQuat.z, -handQuat.w)
      }

      // Gate 2: salto angular grande entre frames → provável flip espúrio, descarta.
      if (last) {
        const dot = Math.min(1, Math.abs(handQuat.dot(last)))
        const angle = 2 * Math.acos(dot)
        if (angle > MAX_FRAME_DELTA_RAD) return
      }

      lastHandQuatRef.current = handQuat.clone()

      const target = handQuat.clone().multiply(SHOE_GRIP_OFFSET)
      store.setTargetQuaternion([target.x, target.y, target.z, target.w])
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

      if (
        !result.landmarks ||
        result.landmarks.length === 0 ||
        !result.worldLandmarks ||
        result.worldLandmarks.length === 0
      ) {
        resetState()
        clearCanvas()
        lastHandQuatRef.current = null
        return
      }

      processFrame(
        result.landmarks[0] as Landmark[],
        result.worldLandmarks[0] as Landmark[],
      )
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
