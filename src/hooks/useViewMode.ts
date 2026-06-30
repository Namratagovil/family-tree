'use client'

import { useState, useEffect, useCallback } from 'react'
import { ViewMode } from '@/types'

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('canvas')
  const [isManual, setIsManual] = useState(false)

  useEffect(() => {
    if (isManual) return

    const mq = window.matchMedia('(max-width: 768px), (orientation: portrait) and (max-width: 1024px)')

    const handler = (e: MediaQueryListEvent) => {
      setViewModeState(e.matches ? 'list' : 'canvas')
    }

    setViewModeState(mq.matches ? 'list' : 'canvas')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [isManual])

  const setViewMode = useCallback((mode: ViewMode) => {
    setIsManual(true)
    setViewModeState(mode)
  }, [])

  const resetToAuto = useCallback(() => {
    setIsManual(false)
  }, [])

  return { viewMode, setViewMode, isManual, resetToAuto }
}
