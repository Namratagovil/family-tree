'use client'

import React from 'react'
import { LayoutNode } from '@/types'
import { getInitials, getBranchColor } from '@/lib/utils'
import { NODE_W, NODE_H } from '@/lib/treeLayout'

interface PersonNodeProps {
  node: LayoutNode
  onClick: () => void
  isSelected?: boolean
}

export default function PersonNode({ node, onClick, isSelected }: PersonNodeProps) {
  const color = getBranchColor(node.id)
  const initials = getInitials(node.name)
  const isUnknown = node.name === 'Unknown' || node.name === ''
  const displayName = isUnknown ? '—' : node.name

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        borderColor: isSelected ? '#F87B2A' : color,
        borderWidth: isSelected ? 2 : 1.5,
      }}
      className="rounded-xl bg-white border flex items-center gap-2 px-2.5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
    >
      {node.photoUrl ? (
        <img
          src={node.photoUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {isUnknown ? '?' : initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11.5px] font-semibold text-gray-800 truncate leading-tight group-hover:text-primary transition-colors">
          {displayName}
        </div>
        <div className="text-[9px] text-gray-400 font-mono">{node.id}</div>
      </div>
    </button>
  )
}
