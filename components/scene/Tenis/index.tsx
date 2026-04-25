'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import ModelDiagnostic from '../ModelDiagnostic'
import { colorMaskUniforms } from '@/lib/colorMaskStore'
import { useHandStore } from '@/lib/handStore'
import { attachColorReplaceShader } from './shader'
import {
  COLOR_LERP_TIME_CONSTANT,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_BODY_COLOR,
  computeOneEuroAlpha,
  ensureShortestPath,
  quaternionEquals,
} from './utils'

type Props = {
  bodyColor: string | null
  accentColor: string | null
}

const MODEL_PATH = '/models/tenis.glb'

useGLTF.preload(MODEL_PATH)

export default function Tenis(props: Props) {
  const { bodyColor, accentColor } = props
  const { scene } = useGLTF(MODEL_PATH)

  const cloned = useMemo(() => {
    const root = scene.clone(true)
    const ownedMaterials: THREE.Material[] = []

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const wrap = (m: THREE.Material) => {
        const next = m.clone()
        attachColorReplaceShader(
          next as THREE.MeshStandardMaterial,
          colorMaskUniforms,
        )
        ownedMaterials.push(next)
        return next
      }

      if (Array.isArray(child.material)) {
        child.material = child.material.map(wrap)
      } else if (child.material) {
        child.material = wrap(child.material)
      }
    })

    return { root, ownedMaterials }
  }, [scene])

  const targetBodyRef = useRef<THREE.Color>(new THREE.Color(DEFAULT_BODY_COLOR))
  const targetAccentRef = useRef<THREE.Color>(new THREE.Color(DEFAULT_ACCENT_COLOR))
  const targetStrengthRef = useRef<number>(0)
  const groupRef = useRef<THREE.Group>(null)
  const targetQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion())
  const prevTargetQuatRef = useRef<THREE.Quaternion | null>(null)

  useEffect(() => {
    if (bodyColor === null || accentColor === null) {
      targetStrengthRef.current = 0
      return
    }
    targetBodyRef.current = new THREE.Color(bodyColor)
    targetAccentRef.current = new THREE.Color(accentColor)
    targetStrengthRef.current = 1
  }, [bodyColor, accentColor])

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(COLOR_LERP_TIME_CONSTANT, delta)
    colorMaskUniforms.uTargetColor.value.lerp(targetBodyRef.current, lerpFactor)
    colorMaskUniforms.uAccentColor.value.lerp(targetAccentRef.current, lerpFactor)
    colorMaskUniforms.uReplaceStrength.value = THREE.MathUtils.lerp(
      colorMaskUniforms.uReplaceStrength.value,
      targetStrengthRef.current,
      lerpFactor,
    )

    const group = groupRef.current
    if (!group) return

    const store = useHandStore.getState()
    const target = store.targetQuaternion
    if (target) {
      const tq = targetQuatRef.current
      tq.set(target[0], target[1], target[2], target[3])

      const prev = prevTargetQuatRef.current
      ensureShortestPath(tq, prev)

      const alpha = computeOneEuroAlpha(tq, prev, delta)
      group.quaternion.slerp(tq, alpha)

      if (prev) {
        prev.copy(tq)
      } else {
        prevTargetQuatRef.current = tq.clone()
      }
    }

    const q = group.quaternion
    const cur = store.currentShoeQuaternion
    if (!quaternionEquals(q, cur)) {
      store.setCurrentShoeQuaternion([q.x, q.y, q.z, q.w])
    }
  })

  return (
    <>
      <ModelDiagnostic scene={cloned.root} />
      <group ref={groupRef}>
        <primitive object={cloned.root} />
      </group>
    </>
  )
}
