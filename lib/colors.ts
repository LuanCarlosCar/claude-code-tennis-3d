export type ShoeVariant = {
  name: string
  label: string
  shortLabel: string
  body: string | null
  accent: string | null
  bg: string
  swatch: { body: string; accent: string }
}

const baseBg = '#0a0a0a'

function makeBg(glowColor: string, opacity: number) {
  return `radial-gradient(ellipse 70% 55% at 68% 42%, ${hexToRgba(glowColor, opacity)} 0%, transparent 60%), radial-gradient(ellipse 90% 50% at 20% 80%, ${hexToRgba(glowColor, opacity * 0.4)} 0%, transparent 65%), ${baseBg}`
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const SHOE_COLORS: readonly ShoeVariant[] = [
  {
    name: 'Original',
    label: 'Onyx · Original',
    shortLabel: 'Onyx',
    body: null,
    accent: null,
    bg: makeBg('#d4763c', 0.22),
    swatch: { body: '#1a1a1a', accent: '#d4a98a' },
  },
  {
    name: 'Pink',
    label: 'Blush Edition',
    shortLabel: 'Blush',
    body: '#D6336C',
    accent: '#FFE5B4',
    bg: makeBg('#D6336C', 0.18),
    swatch: { body: '#D6336C', accent: '#FFE5B4' },
  },
  {
    name: 'Brown',
    label: 'Cocoa Edition',
    shortLabel: 'Cocoa',
    body: '#4A2C1A',
    accent: '#D4A574',
    bg: makeBg('#D4A574', 0.16),
    swatch: { body: '#4A2C1A', accent: '#D4A574' },
  },
] as const
