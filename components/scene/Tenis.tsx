'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import ModelDiagnostic from './ModelDiagnostic'

type Props = {
  color: string | null
}

type OriginalMaterialState = {
  color: THREE.Color
  map: THREE.Texture | null
  vertexColors: boolean
}

const MODEL_PATH = '/models/tenis.glb'

useGLTF.preload(MODEL_PATH)

export default function Tenis(props: Props) {
  const { color } = props
  const { scene } = useGLTF(MODEL_PATH)

  // reason: clone the scene AND clone each material so color overrides don't
  // mutate the cached gltf shared by useGLTF. Geometry stays shared (heavy and
  // safe to share). Disposing the cached materials/geometry would crash WebGL
  // on remount (StrictMode / HMR).
  const cloned = useMemo(() => {
    const root = scene.clone(true)
    const ownedMaterials: THREE.Material[] = []
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => {
          const c = m.clone()
          ownedMaterials.push(c)
          return c
        })
      } else if (child.material) {
        const c = child.material.clone()
        ownedMaterials.push(c)
        child.material = c
      }
    })
    return { root, ownedMaterials }
  }, [scene])

  const originalsRef = useRef<Map<string, OriginalMaterialState>>(new Map())
  const targetColorRef = useRef<THREE.Color | null>(null)
  const isOriginalRef = useRef<boolean>(true)

  useEffect(() => {
    const originals = new Map<string, OriginalMaterialState>()

    cloned.root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((rawMat, i) => {
        const mat = rawMat as THREE.MeshStandardMaterial
        const key = `${child.uuid}::${i}`
        originals.set(key, {
          color: mat.color.clone(),
          map: mat.map ?? null,
          vertexColors: mat.vertexColors,
        })
      })
    })

    originalsRef.current = originals

    return () => {
      cloned.ownedMaterials.forEach((m) => m.dispose())
    }
  }, [cloned])

  useEffect(() => {
    if (color === null) {
      isOriginalRef.current = true
      targetColorRef.current = null
      cloned.root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material]

        materials.forEach((rawMat, i) => {
          const mat = rawMat as THREE.MeshStandardMaterial
          const key = `${child.uuid}::${i}`
          const original = originalsRef.current.get(key)
          if (!original) return
          mat.color.copy(original.color)
          mat.map = original.map
          mat.vertexColors = original.vertexColors
          mat.needsUpdate = true
        })
      })
      return
    }

    isOriginalRef.current = false
    targetColorRef.current = new THREE.Color(color)

    cloned.root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((rawMat) => {
        const mat = rawMat as THREE.MeshStandardMaterial
        if (mat.map) mat.map = null
        if (mat.vertexColors) mat.vertexColors = false
        mat.needsUpdate = true
      })
    })
  }, [color, cloned])

  useFrame((_, delta) => {
    const target = targetColorRef.current
    if (!target || isOriginalRef.current) return

    const lerpFactor = 1 - Math.pow(0.001, delta)

    cloned.root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]
      materials.forEach((rawMat) => {
        const mat = rawMat as THREE.MeshStandardMaterial
        mat.color.lerp(target, lerpFactor)
      })
    })
  })

  return (
    <>
      <ModelDiagnostic scene={cloned.root} />
      <primitive object={cloned.root} />
    </>
  )
}
