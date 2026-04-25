import * as THREE from 'three'

export const COLOR_LERP_TIME_CONSTANT = 0.001
export const ROTATION_BASE_ALPHA = 0.08
export const ROTATION_MAX_ALPHA = 0.18
export const ONE_EURO_MIN_CUTOFF = 0.6
export const ONE_EURO_BETA = 0.08
export const MIN_DELTA_SECONDS = 0.001

export const DEFAULT_BODY_COLOR = '#1a1a1a'
export const DEFAULT_ACCENT_COLOR = '#d4a98a'

export function computeOneEuroAlpha(
  current: THREE.Quaternion,
  previous: THREE.Quaternion | null,
  delta: number,
): number {
  if (!previous) return ROTATION_BASE_ALPHA
  const dot = Math.min(1, Math.abs(current.dot(previous)))
  const angDelta = 2 * Math.acos(dot)
  const angSpeed = angDelta / Math.max(delta, MIN_DELTA_SECONDS)
  const fc = ONE_EURO_MIN_CUTOFF + ONE_EURO_BETA * angSpeed
  const tau = 1 / (2 * Math.PI * fc)
  const alpha = delta / (tau + delta)
  return Math.min(alpha, ROTATION_MAX_ALPHA)
}

export function ensureShortestPath(
  current: THREE.Quaternion,
  previous: THREE.Quaternion | null,
) {
  if (previous && current.dot(previous) < 0) {
    current.set(-current.x, -current.y, -current.z, -current.w)
  }
}

export function quaternionEquals(
  q: THREE.Quaternion,
  arr: readonly [number, number, number, number],
): boolean {
  return arr[0] === q.x && arr[1] === q.y && arr[2] === q.z && arr[3] === q.w
}
