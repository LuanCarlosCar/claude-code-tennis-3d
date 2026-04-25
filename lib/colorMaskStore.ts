import * as THREE from 'three'

export type ColorMaskUniforms = {
  uTargetColor: { value: THREE.Color }
  uAccentColor: { value: THREE.Color }
  uReplaceStrength: { value: number }
  uThreshold: { value: number }
  uSoftness: { value: number }
  uAccentThreshold: { value: number }
  uAccentSoftness: { value: number }
}

export const colorMaskUniforms: ColorMaskUniforms = {
  uTargetColor: { value: new THREE.Color('#1a1a1a') },
  uAccentColor: { value: new THREE.Color('#d4a98a') },
  uReplaceStrength: { value: 0 },
  uThreshold: { value: 0.18 },
  uSoftness: { value: 0.08 },
  uAccentThreshold: { value: 0.25 },
  uAccentSoftness: { value: 0.1 },
}
