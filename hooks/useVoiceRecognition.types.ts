export interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

export interface SpeechRecognitionResult {
  isFinal: boolean
  0: SpeechRecognitionAlternative
}

export interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

export interface SpeechRecognitionErrorEvent {
  error: string
}

export interface SpeechRecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  // reason: Web Speech API is browser-vendored and not in standard lib.dom types
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return win.SpeechRecognition || win.webkitSpeechRecognition
}

export function extractFinalTranscript(
  event: SpeechRecognitionEvent,
): string | null {
  const lastResultIdx = event.results.length - 1
  const result = event.results[lastResultIdx]
  if (!result.isFinal) return null
  return result[0].transcript
}

export function isPermissionDeniedError(error: string): boolean {
  return error === 'not-allowed' || error === 'service-not-allowed'
}
