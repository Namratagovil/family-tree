import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name || name.trim() === '') return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const TERTIARY_COLORS = ['#C89588', '#B4D4CF', '#D2BF96', '#F5AC00']

export function getGenerationColor(generation: number): string {
  return TERTIARY_COLORS[(generation - 1) % TERTIARY_COLORS.length]
}

export function getBranchColor(id: string): string {
  if (id.startsWith('11')) return '#B4D4CF'
  if (id.startsWith('12')) return '#D2BF96'
  return TERTIARY_COLORS[0]
}

/**
 * WCAG relative luminance (per the 1.4.3/1.4.11 contrast formula).
 */
function relativeLuminance(hex: string): number {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA)
  const lB = relativeLuminance(hexB)
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA]
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Picks black or white text — whichever clears WCAG AA (4.5:1) against the
 * given background — so avatar initials stay readable across every branch color.
 */
export function getContrastTextColor(bgHex: string): string {
  const white = '#FFFFFF'
  const black = '#111827'
  return contrastRatio(bgHex, white) >= contrastRatio(bgHex, black) ? white : black
}
