import { SHOE_COLORS } from '@/lib/colors'

export function findColorIndexByName(name: string): number {
  return SHOE_COLORS.findIndex((c) => c.name === name)
}
