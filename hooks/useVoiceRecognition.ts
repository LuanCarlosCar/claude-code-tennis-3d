import { useEffect, useRef } from 'react'
import { useHandStore } from '@/lib/handStore'
import { matchVoiceCommand } from '@/lib/voiceMatcher'

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResult {
  isFinal: boolean
  0: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionInstance {
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

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

interface UseVoiceRecognitionProps {
  enabled: boolean
  onColorRecognized: (color: string | null) => void
}

export function useVoiceRecognition(props: UseVoiceRecognitionProps) {
  const { enabled, onColorRecognized } = props

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const shouldRestartRef = useRef(false)

  const setListening = useHandStore((s) => s.setListening)
  const setVoicePermission = useHandStore((s) => s.setVoicePermission)
  const setLastRecognizedCommand = useHandStore((s) => s.setLastRecognizedCommand)

  useEffect(() => {
    if (!enabled) return

    // reason: Web Speech API is browser-vendored and not in standard lib.dom types
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoicePermission('unsupported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognitionRef.current = recognition
    shouldRestartRef.current = true

    recognition.onstart = () => {
      setListening(true)
      setVoicePermission('granted')
    }

    recognition.onresult = (event) => {
      const lastResultIdx = event.results.length - 1
      const result = event.results[lastResultIdx]
      if (!result.isFinal) return

      const transcript = result[0].transcript
      const match = matchVoiceCommand(transcript)
      if (!match) return

      setLastRecognizedCommand({
        word: match.word,
        color: match.color,
        timestamp: Date.now(),
      })
      onColorRecognized(match.color)
    }

    recognition.onerror = (event) => {
      console.warn('[voice] error:', event.error)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoicePermission('denied')
        shouldRestartRef.current = false
      }
    }

    recognition.onend = () => {
      setListening(false)
      if (!shouldRestartRef.current) return
      try {
        recognition.start()
      } catch (err) {
        console.debug('[voice] restart skipped:', err)
      }
    }

    try {
      recognition.start()
    } catch (err) {
      console.error('[voice] failed to start:', err)
      setVoicePermission('denied')
    }

    return () => {
      shouldRestartRef.current = false
      try {
        recognition.stop()
      } catch {
        // noop
      }
      recognition.onstart = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognitionRef.current = null
      setListening(false)
    }
  }, [enabled, onColorRecognized, setListening, setVoicePermission, setLastRecognizedCommand])
}
