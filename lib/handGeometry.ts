import * as THREE from 'three'

export interface Landmark {
  x: number
  y: number
  z: number
}

export function mirrorLandmarks(landmarks: Landmark[]): Landmark[] {
  return landmarks.map((l) => ({ ...l, x: 1 - l.x }))
}

function distance3D(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function computeAvgCurl(landmarks: Landmark[]): number {
  const handSize = distance3D(landmarks[0], landmarks[9])
  if (handSize === 0) return 1

  const indexCurl = distance3D(landmarks[8], landmarks[5]) / handSize
  const middleCurl = distance3D(landmarks[12], landmarks[9]) / handSize
  const ringCurl = distance3D(landmarks[16], landmarks[13]) / handSize
  const pinkyCurl = distance3D(landmarks[20], landmarks[17]) / handSize

  return (indexCurl + middleCurl + ringCurl + pinkyCurl) / 4
}

export function computeHandQuaternion(landmarks: Landmark[]): THREE.Quaternion {
  const wrist = new THREE.Vector3(landmarks[0].x, landmarks[0].y, landmarks[0].z)
  const middleBase = new THREE.Vector3(landmarks[9].x, landmarks[9].y, landmarks[9].z)
  const indexBase = new THREE.Vector3(landmarks[5].x, landmarks[5].y, landmarks[5].z)
  const pinkyBase = new THREE.Vector3(landmarks[17].x, landmarks[17].y, landmarks[17].z)

  const yAxis = middleBase.clone().sub(wrist).normalize()
  const xAxis = pinkyBase.clone().sub(indexBase).normalize()
  const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize()
  xAxis.crossVectors(yAxis, zAxis).normalize()

  const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis)
  return new THREE.Quaternion().setFromRotationMatrix(matrix)
}

export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]
