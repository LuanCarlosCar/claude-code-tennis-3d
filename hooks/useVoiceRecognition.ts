import { useEffect, useRef } from 'react'
import { useHandStore } from '@/lib/handStore'
import { matchVoiceCommand } from '@/lib/voiceMatcher'
import {
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
  extractFinalTranscript,
  getSpeechRecognitionCtor,
  isPermissionDeniedError,
} from './useVoiceRecognition.types'

interface UseVoiceRecognitionProps {
  enabled: boolean
  onColorRecognized: (color: string | null) => void
}

const RECOGNITION_LANG = 'pt-BR'

export function useVoiceRecognition(props: UseVoiceRecognitionProps) {
  const { enabled, onColorRecognized } = props

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const shouldRestartRef = useRef(false)
  const onColorRecognizedRef = useRef(onColorRecognized)

  const setListening = useHandStore((s) => s.setListening)
  const setVoicePermission = useHandStore((s) => s.setVoicePermission)
  const setLastRecognizedCommand = useHandStore((s) => s.setLastRecognizedCommand)

  useEffect(() => {
    onColorRecognizedRef.current = onColorRecognized
  }, [onColorRecognized])

  useEffect(() => {
    if (!enabled) return
    return startRecognition()


  }, [enabled])

  function startRecognition(): () => void {
    const SpeechRecognition = getSpeechRecognitionCtor()
    if (!SpeechRecognition) {
      setVoicePermission('unsupported')
      return () => undefined
    }

    const recognition = new SpeechRecognition()
    recognition.lang = RECOGNITION_LANG
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = handleStart
    recognition.onresult = handleResult
    recognition.onerror = handleError
    recognition.onend = handleEnd

    recognitionRef.current = recognition
    shouldRestartRef.current = true

    try {
      recognition.start()
    } catch (err) {
      console.error('[voice] failed to start:', err)
      setVoicePermission('denied')
    }

    return () => stopRecognition(recognition)
  }

  function handleStart() {
    setListening(true)
    setVoicePermission('granted')
  }

  function handleResult(event: SpeechRecognitionEvent) {
    const transcript = extractFinalTranscript(event)
    if (transcript === null) return
    const match = matchVoiceCommand(transcript)
    if (!match) return

    setLastRecognizedCommand({
      word: match.word,
      color: match.color,
      timestamp: Date.now(),
    })
    onColorRecognizedRef.current(match.color)
  }

  function handleError(event: SpeechRecognitionErrorEvent) {
    console.warn('[voice] error:', event.error)
    if (isPermissionDeniedError(event.error)) {
      setVoicePermission('denied')
      shouldRestartRef.current = false
    }
  }

  function handleEnd() {
    setListening(false)
    if (!shouldRestartRef.current) return
    const recognition = recognitionRef.current
    if (!recognition) return
    try {
      recognition.start()
    } catch {

    }
  }

  function stopRecognition(recognition: SpeechRecognitionInstance) {
    shouldRestartRef.current = false
    try {
      recognition.stop()
    } catch {

    }
    recognition.onstart = null
    recognition.onresult = null
    recognition.onerror = null
    recognition.onend = null
    recognitionRef.current = null
    setListening(false)
  }
}
