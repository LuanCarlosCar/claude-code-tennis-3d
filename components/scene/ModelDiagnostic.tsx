'use client'

import { useEffect } from 'react'
import * as THREE from 'three'

type Props = {
  scene: THREE.Object3D
}

type DiagnosticRow = {
  meshName: string
  materialName: string
  materialType: string
  baseColorHex: string
  hasMap: boolean
  hasNormalMap: boolean
  usesVertexColors: boolean
  triangles: number
}

export default function ModelDiagnostic(props: Props) {
  const { scene } = props

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const rows: DiagnosticRow[] = []

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((rawMat) => {
        const mat = rawMat as THREE.MeshStandardMaterial
        const geometry = child.geometry as THREE.BufferGeometry
        const triangles = geometry.index
          ? geometry.index.count / 3
          : geometry.attributes.position
            ? geometry.attributes.position.count / 3
            : 0

        rows.push({
          meshName: child.name || '(unnamed)',
          materialName: mat.name || '(unnamed)',
          materialType: mat.type,
          baseColorHex: mat.color ? `#${mat.color.getHexString()}` : '—',
          hasMap: Boolean(mat.map),
          hasNormalMap: Boolean(mat.normalMap),
          usesVertexColors: Boolean(mat.vertexColors),
          triangles: Math.round(triangles),
        })
      })
    })

    console.group('[ModelDiagnostic] tenis.glb')
    console.table(rows)
    console.groupEnd()
  }, [scene])

  if (process.env.NODE_ENV !== 'development') return null
  return null
}
