'use client'

import { useCallback, useState } from 'react'
import TenisScene from '@/components/scene/TenisScene'
import ColorCyclerButton from '@/components/ui/ColorCyclerButton'
import Footer from '@/components/ui/Footer'
import { SHOE_COLORS } from '@/lib/colors'

export default function Home() {
  const [colorIndex, setColorIndex] = useState(0)

  const handleCycle = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % SHOE_COLORS.length)
  }, [])

  const currentColor = SHOE_COLORS[colorIndex].value

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-neutral-950">
      <TenisScene color={currentColor} />
      <Footer />
      <ColorCyclerButton colorIndex={colorIndex} onCycle={handleCycle} />
    </main>
  )
}
