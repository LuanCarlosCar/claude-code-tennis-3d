import { useEffect, RefObject, useRef } from 'react'
import * as THREE from 'three'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { useHandStore } from '@/lib/handStore'
import {
  Landmark,
  computeHandQuaternion,
  computePalmConfidence,
} from '@/lib/handGeometry'
import {
  HAND_TRACKING_CONFIG,
  SHOE_GRIP_OFFSET,
  clearCanvas,
  computePalmSize,
  drawSkeleton,
  palmSizeToCameraDistance,
} from './useHandTracking.utils'

interface UseHandTrackingProps {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  enabled: boolean
}

export function useHandTracking(props: UseHandTrackingProps) {
  const { videoRef, canvasRef, enabled } = props

  const lastInferRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const lastHandQuatRef = useRef<THREE.Quaternion | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    cancelledRef.current = false
    initLandmarker()
    return teardown


  }, [enabled, videoRef, canvasRef])

  async function initLandmarker() {
    try {
      const fileset = await FilesetResolver.forVisionTasks(
        HAND_TRACKING_CONFIG.visionTasksWasm,
      )
      if (cancelledRef.current) return
      const landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: HAND_TRACKING_CONFIG.handLandmarkerModel,
          delegate: 'GPU',
        },
        numHands: 1,
        runningMode: 'VIDEO',
      })
      if (cancelledRef.current) {
        landmarker.close()
        return
      }
      landmarkerRef.current = landmarker
      scheduleFrame()
    } catch (err) {
      console.error('[hand-tracking] init failed:', err)
    }
  }

  function scheduleFrame() {
    if (cancelledRef.current) return
    rafRef.current = requestAnimationFrame(runFrame)
  }

  function runFrame() {
    scheduleFrame()
    const now = performance.now()
    if (now - lastInferRef.current < HAND_TRACKING_CONFIG.targetIntervalMs) return
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
      !result.landmarks?.length ||
      !result.worldLandmarks?.length
    ) {
      resetState()
      const canvas = canvasRef.current
      if (canvas) clearCanvas(canvas)
      lastHandQuatRef.current = null
      return
    }

    processFrame(
      result.landmarks[0] as Landmark[],
      result.worldLandmarks[0] as Landmark[],
    )
  }

  function processFrame(
    imageLandmarks: Landmark[],
    worldLandmarks: Landmark[],
  ) {
    const store = useHandStore.getState()
    store.setHandDetected(true)
    store.setArmed(true)
    store.setGripping(true)

    const canvas = canvasRef.current
    if (canvas) drawSkeleton(canvas, imageLandmarks, true)


    const palmConfidence = computePalmConfidence(worldLandmarks)
    if (palmConfidence < HAND_TRACKING_CONFIG.palmConfidenceMin) return

    const handQuat = computeHandQuaternion(worldLandmarks)

    const last = lastHandQuatRef.current
    if (last && handQuat.dot(last) < 0) {
      handQuat.set(-handQuat.x, -handQuat.y, -handQuat.z, -handQuat.w)
    }


    if (last) {
      const dot = Math.min(1, Math.abs(handQuat.dot(last)))
      const angle = 2 * Math.acos(dot)
      if (angle > HAND_TRACKING_CONFIG.maxFrameDeltaRad) return
    }

    lastHandQuatRef.current = handQuat.clone()

    const target = handQuat.clone().multiply(SHOE_GRIP_OFFSET)
    store.setTargetQuaternion([target.x, target.y, target.z, target.w])

    const palmSize = computePalmSize(imageLandmarks)
    store.setTargetDistance(palmSizeToCameraDistance(palmSize))
  }

  function resetState() {
    const store = useHandStore.getState()
    store.setHandDetected(false)
    store.setArmed(false)
    store.setGripping(false)
  }

  function teardown() {
    cancelledRef.current = true
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
    if (canvas) clearCanvas(canvas)
    const store = useHandStore.getState()
    store.setTargetQuaternion(null)
    store.setTargetDistance(null)
  }
}
