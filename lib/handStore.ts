import { create } from 'zustand'

export type CameraPermission = 'idle' | 'requesting' | 'granted' | 'denied'
export type VoicePermission = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

type Quat = [number, number, number, number]

export interface RecognizedCommand {
  word: string
  color: string | null
  timestamp: number
}

interface HandState {
  isHandModeEnabled: boolean
  toggleHandMode: () => void
  setHandModeEnabled: (v: boolean) => void

  cameraPermission: CameraPermission
  setCameraPermission: (s: CameraPermission) => void

  isHandDetected: boolean
  isArmed: boolean
  isGripping: boolean
  setHandDetected: (v: boolean) => void
  setArmed: (v: boolean) => void
  setGripping: (v: boolean) => void

  targetQuaternion: Quat | null
  setTargetQuaternion: (q: Quat | null) => void

  targetDistance: number | null
  setTargetDistance: (d: number | null) => void

  currentShoeQuaternion: Quat
  setCurrentShoeQuaternion: (q: Quat) => void

  isVoiceEnabled: boolean
  voicePermission: VoicePermission
  isListening: boolean
  lastRecognizedCommand: RecognizedCommand | null
  toggleVoice: () => void
  setVoiceEnabled: (v: boolean) => void
  setVoicePermission: (p: VoicePermission) => void
  setListening: (v: boolean) => void
  setLastRecognizedCommand: (cmd: RecognizedCommand | null) => void
}

export const useHandStore = create<HandState>((set) => ({
  isHandModeEnabled: false,
  toggleHandMode: () => set((s) => ({ isHandModeEnabled: !s.isHandModeEnabled })),
  setHandModeEnabled: (v) => set({ isHandModeEnabled: v }),

  cameraPermission: 'idle',
  setCameraPermission: (s) => set({ cameraPermission: s }),

  isHandDetected: false,
  isArmed: false,
  isGripping: false,
  setHandDetected: (v) => set({ isHandDetected: v }),
  setArmed: (v) => set({ isArmed: v }),
  setGripping: (v) => set({ isGripping: v }),

  targetQuaternion: null,
  setTargetQuaternion: (q) => set({ targetQuaternion: q }),

  targetDistance: null,
  setTargetDistance: (d) => set({ targetDistance: d }),

  currentShoeQuaternion: [0, 0, 0, 1],
  setCurrentShoeQuaternion: (q) => set({ currentShoeQuaternion: q }),

  isVoiceEnabled: false,
  voicePermission: 'idle',
  isListening: false,
  lastRecognizedCommand: null,
  toggleVoice: () => set((s) => ({ isVoiceEnabled: !s.isVoiceEnabled })),
  setVoiceEnabled: (v) => set({ isVoiceEnabled: v }),
  setVoicePermission: (p) => set({ voicePermission: p }),
  setListening: (v) => set({ isListening: v }),
  setLastRecognizedCommand: (cmd) => set({ lastRecognizedCommand: cmd }),
}))
