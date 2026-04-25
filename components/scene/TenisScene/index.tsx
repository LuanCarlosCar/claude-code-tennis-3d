'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import Tenis from '../Tenis'
import LoadingState from '@/components/ui/LoadingState'
import { useHandStore } from '@/lib/handStore'
import HandZoomController from './HandZoomController'
import { CAMERA_CONFIG, CONTACT_SHADOW_CONFIG, ORBIT_CONFIG } from './config'

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
        camera={{ position: CAMERA_CONFIG.position, fov: CAMERA_CONFIG.fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Tenis bodyColor={bodyColor} accentColor={accentColor} />
          <ContactShadows
            position={CONTACT_SHADOW_CONFIG.position}
            opacity={CONTACT_SHADOW_CONFIG.opacity}
            scale={CONTACT_SHADOW_CONFIG.scale}
            blur={CONTACT_SHADOW_CONFIG.blur}
            far={CONTACT_SHADOW_CONFIG.far}
          />
        </Suspense>
        <OrbitControls
          enabled={!isHandModeEnabled}
          enablePan={false}
          minDistance={ORBIT_CONFIG.minDistance}
          maxDistance={ORBIT_CONFIG.maxDistance}
          enableDamping
          dampingFactor={ORBIT_CONFIG.dampingFactor}
        />
        <HandZoomController />
      </Canvas>
      <LoadingState />
    </>
  )
}
