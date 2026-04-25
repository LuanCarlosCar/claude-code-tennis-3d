export const SHOE_COLORS = [
  { name: 'Original', value: null, label: 'Original' },
  { name: 'Sunset', value: '#D4763C', label: 'Sunset' },
  { name: 'Ink', value: '#1a1a1a', label: 'Ink' },
  { name: 'Court', value: '#C8102E', label: 'Court Red' },
  { name: 'Forest', value: '#1B4332', label: 'Forest' },
  { name: 'Royal', value: '#1E3A8A', label: 'Royal' },
] as const

export type ShoeColor = (typeof SHOE_COLORS)[number]
