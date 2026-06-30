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
