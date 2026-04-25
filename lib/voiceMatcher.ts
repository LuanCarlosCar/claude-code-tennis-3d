import { VOICE_COMMAND_MAP } from './voiceCommands'

export interface MatchResult {
  word: string
  color: string | null
}

export function matchVoiceCommand(transcript: string): MatchResult | null {
  const normalized = transcript
    .toLowerCase()
    .trim()
    .replace(/[.,!?;]/g, '')

  const words = normalized.split(/\s+/)

  for (const word of words) {
    if (word in VOICE_COMMAND_MAP) {
      return {
        word,
        color: VOICE_COMMAND_MAP[word],
      }
    }
  }

  return null
}
