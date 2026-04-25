'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useHandStore } from '@/lib/handStore'
import {
  HAND_ZOOM_MAX_ALPHA,
  HAND_ZOOM_TIME_CONSTANT,
  MIN_CAMERA_DISTANCE_EPSILON,
  ORBIT_CONFIG,
} from './config'

export default function HandZoomController() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const store = useHandStore.getState()
    if (!store.isHandModeEnabled) return
    const target = store.targetDistance
    if (target == null) return

    const dir = camera.position.length()
    if (dir < MIN_CAMERA_DISTANCE_EPSILON) return

    // reason: clamp alpha pra que aproximação/afastamento da mão sejam
    // amaciados em várias frames, evitando salto de zoom por jitter.
    const lerpFactor = 1 - Math.pow(HAND_ZOOM_TIME_CONSTANT, delta)
    const alpha = Math.min(lerpFactor, HAND_ZOOM_MAX_ALPHA)
    const next = THREE.MathUtils.lerp(dir, target, alpha)
    camera.position.setLength(
      THREE.MathUtils.clamp(next, ORBIT_CONFIG.minDistance, ORBIT_CONFIG.maxDistance),
    )
  })

  return null
}
