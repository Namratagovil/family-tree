'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Person, LayoutNode } from '@/types'
import { computeLayout, NODE_W, NODE_H } from '@/lib/treeLayout'
import PersonNode from './PersonNode'

interface CanvasViewProps {
  members: Person[]
  selectedId: string | null
  onSelectPerson: (person: Person) => void
}

interface Transform {
  x: number
  y: number
  scale: number
}

export default function CanvasView({ members, selectedId, onSelectPerson }: CanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 40, scale: 0.72 })
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef<number | null>(null)

  const layout = useMemo(() => computeLayout(members), [members])

  // Center root on mount
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { width: cw } = container.getBoundingClientRect()
    const rootNode = layout.nodes.find(n => n.id === '1')
    if (!rootNode) return
    const scale = 0.72
    setTransform({
      x: cw / 2 - (rootNode.x + NODE_W / 2) * scale,
      y: 40,
      scale,
    })
  }, [layout])

  const clampScale = (s: number) => Math.max(0.15, Math.min(2.2, s))

  // Mouse pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button[data-node]')) return
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

  const resetView = () => {
    const container = containerRef.current
    if (!container) return
    const { width: cw } = container.getBoundingClientRect()
    const rootNode = layout.nodes.find(n => n.id === '1')
    if (!rootNode) return
    const scale = 0.72
    setTransform({ x: cw / 2 - (rootNode.x + NODE_W / 2) * scale, y: 40, scale })
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                stroke="#004C2B"
                strokeWidth="1.5"
                strokeOpacity="0.45"
              />
            ))}
          </svg>

          {/* Nodes */}
          {layout.nodes.map(node => (
            <div
              key={node.id}
              data-node="true"
              style={{ position: 'absolute', left: 0, top: 0 }}
            >
              <PersonNode
                node={node}
                isSelected={selectedId === node.id}
                onClick={() => onSelectPerson(node)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => zoom(1.2)}
          className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => zoom(1 / 1.2)}
          className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomOut className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={resetView}
          className="w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Maximize2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-6 left-6 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200">
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  )
}
