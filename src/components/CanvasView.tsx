'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Person, LayoutDirection, LayoutAlignment, ThemeMode } from '@/types'
import { computeLayout, getDefaultCollapsedIds } from '@/lib/treeLayout'
import PersonNode from './PersonNode'

interface CanvasViewProps {
  members: Person[]
  selectedId: string | null
  onSelectPerson: (person: Person) => void
  direction: LayoutDirection
  alignment: LayoutAlignment
  theme: ThemeMode
  collapsedIds: Set<string>
  onToggleCollapse: (id: string) => void
}

interface Transform {
  x: number
  y: number
  scale: number
}

const EDGE_STROKE_WIDTH = 2.75
const PAN_STEP = 60

export default function CanvasView({
  members,
  selectedId,
  onSelectPerson,
  direction,
  alignment,
  theme,
  collapsedIds,
  onToggleCollapse,
}: CanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 40, scale: 0.72 })
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef<number | null>(null)

  const layout = useMemo(
    () => computeLayout(members, { direction, alignment, collapsedIds }),
    [members, direction, alignment, collapsedIds]
  )

  const clampScale = (s: number) => Math.max(0.15, Math.min(2.2, s))

  const fitToView = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const { width: cw, height: ch } = container.getBoundingClientRect()
    if (cw === 0 || ch === 0) return
    const padding = 48
    const scale = clampScale(
      Math.min((cw - padding * 2) / layout.canvasWidth, (ch - padding * 2) / layout.canvasHeight, 0.85)
    )
    setTransform({
      x: (cw - layout.canvasWidth * scale) / 2,
      y: (ch - layout.canvasHeight * scale) / 2,
      scale,
    })
  }, [layout])

  // Fit whenever the tree or its arrangement changes
  useEffect(() => {
    fitToView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  // Fit whenever the container itself is resized (window resize, orientation
  // change, sidebar collapse, devtools opening) so the tree never ends up
  // clipped or off-center after the viewport changes.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => fitToView())
    observer.observe(container)
    return () => observer.disconnect()
  }, [fitToView])

  // Mouse pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const stopDrag = useCallback(() => { isDragging.current = false }, [])

  // Wheel zoom (zoom towards cursor)
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.12 : 0.89

    setTransform(prev => {
      const newScale = clampScale(prev.scale * factor)
      const ratio = newScale / prev.scale
      return {
        x: cx - ratio * (cx - prev.x),
        y: cy - ratio * (cy - prev.y),
        scale: newScale,
      }
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Touch pan + pinch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x
      const dy = e.touches[0].clientY - lastPos.current.y
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const factor = dist / lastTouchDist.current
      lastTouchDist.current = dist
      setTransform(prev => ({ ...prev, scale: clampScale(prev.scale * factor) }))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    lastTouchDist.current = null
  }, [])

  const zoom = (delta: number) =>
    setTransform(prev => ({ ...prev, scale: clampScale(prev.scale * delta) }))

  // Keyboard operability: arrow keys pan, +/- zoom, 0 fits the tree to view.
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setTransform(prev => ({ ...prev, y: prev.y + PAN_STEP }))
        break
      case 'ArrowDown':
        e.preventDefault()
        setTransform(prev => ({ ...prev, y: prev.y - PAN_STEP }))
        break
      case 'ArrowLeft':
        e.preventDefault()
        setTransform(prev => ({ ...prev, x: prev.x + PAN_STEP }))
        break
      case 'ArrowRight':
        e.preventDefault()
        setTransform(prev => ({ ...prev, x: prev.x - PAN_STEP }))
        break
      case '+':
      case '=':
        e.preventDefault()
        zoom(1.2)
        break
      case '-':
      case '_':
        e.preventDefault()
        zoom(1 / 1.2)
        break
      case '0':
        e.preventDefault()
        fitToView()
        break
    }
  }, [fitToView])

  const edgeColor = theme === 'dark' ? '#6EE7B7' : '#004C2B'
  const childEdge = direction === 'bottom-up' ? 'top' : 'bottom'

  return (
    <div className="relative w-full h-full min-w-0 min-h-0">
      <div
        ref={containerRef}
        role="application"
        aria-label="Family tree canvas. Use arrow keys to pan, plus and minus to zoom, 0 to fit the tree to view. Press Tab to move between family members. Each person with descendants has an expand or collapse button."
        tabIndex={0}
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none bg-background dark:bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-fg dark:focus-visible:ring-accent-fgDark"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        style={{ touchAction: 'none' }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            width: layout.canvasWidth,
            height: layout.canvasHeight,
            position: 'relative',
            willChange: 'transform',
          }}
        >
          {/* Edge SVG */}
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: layout.canvasWidth,
              height: layout.canvasHeight,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            {layout.edges.map(edge => (
              <path
                key={edge.id}
                d={edge.path}
                fill="none"
                stroke={edgeColor}
                strokeWidth={EDGE_STROKE_WIDTH}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Nodes */}
          {layout.nodes.map(node => (
            <PersonNode
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              onClick={() => onSelectPerson(node)}
              onToggleCollapse={() => onToggleCollapse(node.id)}
              childEdge={childEdge}
            />
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 z-10" role="group" aria-label="Zoom controls">
        <button
          onClick={() => zoom(1.2)}
          aria-label="Zoom in"
          className="w-9 h-9 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
        >
          <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>
        <button
          onClick={() => zoom(1 / 1.2)}
          aria-label="Zoom out"
          className="w-9 h-9 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
        >
          <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>
        <button
          onClick={fitToView}
          aria-label="Fit tree to view"
          className="w-9 h-9 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
        >
          <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>
      </div>

      {/* Scale indicator */}
      <div
        className="absolute bottom-6 left-6 text-xs text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700"
        aria-live="polite"
      >
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  )
}
