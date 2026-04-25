'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import Tenis from './Tenis'
import LoadingState from '@/components/ui/LoadingState'

type Props = {
  color: string | null
}

export default function TenisScene(props: Props) {
  const { color } = props

  return (
    <>
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Tenis color={color} />
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.5}
            scale={6}
            blur={2.5}
            far={2}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      <LoadingState />
    </>
  )
}
