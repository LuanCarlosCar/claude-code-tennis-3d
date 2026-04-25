'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
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
        className="absolute inset-0"
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
      </Canvas>
      <LoadingState />
    </>
  )
}
