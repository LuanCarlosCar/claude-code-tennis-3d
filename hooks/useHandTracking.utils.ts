import * as THREE from 'three'
import { HAND_CONNECTIONS, Landmark } from '@/lib/handGeometry'

export const HAND_TRACKING_CONFIG = {
  targetIntervalMs: 33,
  visionTasksWasm:
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
  handLandmarkerModel:
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',



  palmConfidenceMin: 0.4,
  maxFrameDeltaRad: Math.PI / 6,

  palmSizeMin: 0.16,
  palmSizeMax: 0.5,
  cameraDistFar: 4.0,
  cameraDistNear: 1.4,
} as const

export const SKELETON_GRIP_COLOR = '#D4763C'
export const SKELETON_IDLE_COLOR = '#ffffff'
export const SKELETON_LINE_WIDTH = 2
export const SKELETON_DOT_RADIUS = 3
export const WRIST_INDEX = 0
export const MIDDLE_MCP_INDEX = 9

export const SHOE_GRIP_OFFSET = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, 0),
)

export function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

export function computePalmSize(landmarks: Landmark[]): number {
  const wrist = landmarks[WRIST_INDEX]
  const middleMcp = landmarks[MIDDLE_MCP_INDEX]
  const dx = middleMcp.x - wrist.x
  const dy = middleMcp.y - wrist.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function palmSizeToCameraDistance(palmSize: number): number {
  const { palmSizeMin, palmSizeMax, cameraDistFar, cameraDistNear } =
    HAND_TRACKING_CONFIG
  const t = clamp01((palmSize - palmSizeMin) / (palmSizeMax - palmSizeMin))
  return cameraDistFar + (cameraDistNear - cameraDistFar) * t
}

export function drawSkeleton(
  canvas: HTMLCanvasElement,
  landmarks: Landmark[],
  gripping: boolean,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  const color = gripping ? SKELETON_GRIP_COLOR : SKELETON_IDLE_COLOR
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = SKELETON_LINE_WIDTH

  for (const [a, b] of HAND_CONNECTIONS) {
    const la = landmarks[a]
    const lb = landmarks[b]
    ctx.beginPath()
    ctx.moveTo(la.x * w, la.y * h)
    ctx.lineTo(lb.x * w, lb.y * h)
    ctx.stroke()
  }
  for (const l of landmarks) {
    ctx.beginPath()
    ctx.arc(l.x * w, l.y * h, SKELETON_DOT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
