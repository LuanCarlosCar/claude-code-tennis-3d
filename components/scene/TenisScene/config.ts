export const CAMERA_CONFIG = {
  position: [1.5, 0.45, 1.7] as [number, number, number],
  fov: 38,
} as const

export const ORBIT_CONFIG = {
  minDistance: 1.2,
  maxDistance: 5,
  dampingFactor: 0.05,
} as const

export const CONTACT_SHADOW_CONFIG = {
  position: [0, -0.6, 0] as [number, number, number],
  opacity: 0.5,
  scale: 6,
  blur: 2.5,
  far: 2,
} as const

export const HAND_ZOOM_TIME_CONSTANT = 0.001
export const HAND_ZOOM_MAX_ALPHA = 0.12
export const MIN_CAMERA_DISTANCE_EPSILON = 1e-4
