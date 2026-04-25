'use client'

import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Tenis from './Tenis'
import LoadingState from '@/components/ui/LoadingState'
import { useHandStore } from '@/lib/handStore'

type Props = {
  bodyColor: string | null
  accentColor: string | null
}

export default function TenisScene(props: Props) {
  const { bodyColor, accentColor } = props
  const isHandModeEnabled = useHandStore((s) => s.isHandModeEnabled)

  return (
    <>
      <Canvas
        className="absolute inset-0 touch-pan-y lg:touch-none"
        camera={{ position: [1.5, 0.45, 1.7], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Tenis bodyColor={bodyColor} accentColor={accentColor} />
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.5}
            scale={6}
            blur={2.5}
            far={2}
          />
        </Suspense>
        <OrbitControls
          enabled={!isHandModeEnabled}
          enablePan={false}
          minDistance={1.2}
          maxDistance={5}
          enableDamping
          dampingFactor={0.05}
        />
        <HandZoomController />
      </Canvas>
      <LoadingState />
    </>
  )
}

function HandZoomController() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const store = useHandStore.getState()
    if (!store.isHandModeEnabled) return
    const target = store.targetDistance
    if (target == null) return

    const dir = camera.position.length()
    if (dir < 1e-4) return

    // reason: clamp alpha pra que aproximação/afastamento da mão sejam
    // amaciados em várias frames, evitando salto de zoom por jitter.
    const lerpFactor = 1 - Math.pow(0.001, delta)
    const alpha = Math.min(lerpFactor, 0.12)
    const next = THREE.MathUtils.lerp(dir, target, alpha)
    camera.position.setLength(THREE.MathUtils.clamp(next, 1.2, 5))
  })

  return null
}
