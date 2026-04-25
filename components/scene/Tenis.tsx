'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import ModelDiagnostic from './ModelDiagnostic'
import {
  colorMaskUniforms,
  type ColorMaskUniforms,
} from '@/lib/colorMaskStore'
import { useHandStore } from '@/lib/handStore'

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

  const targetBodyRef = useRef<THREE.Color>(new THREE.Color('#1a1a1a'))
  const targetAccentRef = useRef<THREE.Color>(new THREE.Color('#d4a98a'))
  const targetStrengthRef = useRef<number>(0)
  const groupRef = useRef<THREE.Group>(null)
  const targetQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion())

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
    const lerpFactor = 1 - Math.pow(0.001, delta)
    colorMaskUniforms.uTargetColor.value.lerp(targetBodyRef.current, lerpFactor)
    colorMaskUniforms.uAccentColor.value.lerp(
      targetAccentRef.current,
      lerpFactor,
    )
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
      targetQuatRef.current.set(target[0], target[1], target[2], target[3])
      group.quaternion.slerp(targetQuatRef.current, 0.15)
    }

    const q = group.quaternion
    const cur = store.currentShoeQuaternion
    if (cur[0] !== q.x || cur[1] !== q.y || cur[2] !== q.z || cur[3] !== q.w) {
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

function attachColorReplaceShader(
  material: THREE.MeshStandardMaterial,
  uniforms: ColorMaskUniforms,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTargetColor = uniforms.uTargetColor
    shader.uniforms.uAccentColor = uniforms.uAccentColor
    shader.uniforms.uReplaceStrength = uniforms.uReplaceStrength
    shader.uniforms.uThreshold = uniforms.uThreshold
    shader.uniforms.uSoftness = uniforms.uSoftness
    shader.uniforms.uAccentThreshold = uniforms.uAccentThreshold
    shader.uniforms.uAccentSoftness = uniforms.uAccentSoftness

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      uniform vec3 uTargetColor;
      uniform vec3 uAccentColor;
      uniform float uReplaceStrength;
      uniform float uThreshold;
      uniform float uSoftness;
      uniform float uAccentThreshold;
      uniform float uAccentSoftness;
      `,
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #ifdef USE_MAP
        vec4 sampledDiffuseColor = texture2D( map, vMapUv );
        vec3 srcRgb = sampledDiffuseColor.rgb;

        float lum = dot(srcRgb, vec3(0.299, 0.587, 0.114));
        float darkMask = 1.0 - smoothstep(uThreshold - uSoftness, uThreshold + uSoftness, lum);

        float maxC = max(max(srcRgb.r, srcRgb.g), srcRgb.b);
        float minC = min(min(srcRgb.r, srcRgb.g), srcRgb.b);
        float sat = maxC > 0.0 ? (maxC - minC) / maxC : 0.0;
        float accentMask = smoothstep(uAccentThreshold - uAccentSoftness, uAccentThreshold + uAccentSoftness, sat);

        accentMask *= (1.0 - darkMask);

        vec3 afterDark = mix(srcRgb, uTargetColor, darkMask * uReplaceStrength);
        vec3 afterAccent = mix(afterDark, uAccentColor, accentMask * uReplaceStrength);

        sampledDiffuseColor.rgb = afterAccent;
        diffuseColor *= sampledDiffuseColor;
      #endif
      `,
    )
  }
  material.needsUpdate = true
}
