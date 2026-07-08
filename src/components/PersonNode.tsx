'use client'

import React from 'react'
import { LayoutNode } from '@/types'
import { getInitials, getBranchColor, getContrastTextColor } from '@/lib/utils'
import { NODE_W, NODE_H } from '@/lib/treeLayout'

interface PersonNodeProps {
  node: LayoutNode
  onClick: () => void
  isSelected?: boolean
  onToggleCollapse?: () => void
  /** Which edge of the node its children render on, so the toggle sits next to them. */
  childEdge?: 'top' | 'bottom'
}

export default function PersonNode({ node, onClick, isSelected, onToggleCollapse, childEdge = 'bottom' }: PersonNodeProps) {
  const color = getBranchColor(node.id)
  const avatarTextColor = getContrastTextColor(color)
  const initials = getInitials(node.name)
  const isUnknown = node.name === 'Unknown' || node.name === ''
  const displayName = isUnknown ? '—' : node.name
  const hasSpouse = !!node.spouse && node.spouse.trim() !== ''

  return (
    <div
      data-node="true"
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
      }}
    >
      <button
        onClick={onClick}
        aria-label={`${displayName}${hasSpouse ? `, spouse ${node.spouse}` : ''}, ID ${node.id}, generation ${node.generation}${isSelected ? ', selected' : ''}`}
        aria-pressed={isSelected}
        style={{
          width: '100%',
          height: '100%',
          borderColor: isSelected ? '#F87B2A' : color,
          borderWidth: isSelected ? 2.5 : 1.5,
        }}
        className="rounded-xl bg-white dark:bg-gray-800 border flex flex-col justify-center gap-1 px-2.5 py-1.5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
      >
        {/* Blood-family member: colored avatar + bold name signal "born into the family" */}
        <div className="flex items-center gap-2">
          {node.photoUrl ? (
            <img
              src={node.photoUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: color, color: avatarTextColor }}
            >
              {isUnknown ? '?' : initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
              {displayName}
            </div>
            <div className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">{node.id}</div>
          </div>
        </div>

        {/* Spouse: plain (uncolored) + labeled, so married-in relatives read as distinct from blood family */}
        {hasSpouse && (
          <div className="flex items-baseline gap-1.5 pt-1 mt-0.5 border-t border-gray-100 dark:border-gray-700">
            <span className="text-[8px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 flex-shrink-0">
              Spouse
            </span>
            <span className="text-[10.5px] font-normal text-gray-600 dark:text-gray-300 truncate">
              {node.spouse}
            </span>
          </div>
        )}
      </button>

      {node.hasChildren && onToggleCollapse && (
        <button
          onClick={e => {
            e.stopPropagation()
            onToggleCollapse()
          }}
          aria-label={
            node.isCollapsed
              ? `Expand ${displayName}'s ${node.childCount} ${node.childCount === 1 ? 'child' : 'children'}`
              : `Collapse ${displayName}'s children`
          }
          aria-expanded={!node.isCollapsed}
          style={{
            position: 'absolute',
            left: '50%',
            [childEdge === 'top' ? 'top' : 'bottom']: 0,
            transform: `translate(-50%, ${childEdge === 'top' ? '-50%' : '50%'})`,
            height: 26,
          }}
          className="flex items-center justify-center whitespace-nowrap px-3 rounded-full bg-accent text-gray-900 border-2 border-white dark:border-gray-950 shadow-sm hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent-fg dark:focus-visible:ring-accent-fgDark text-[10.5px] font-bold leading-none"
        >
          {node.isCollapsed ? `Expand · ${node.childCount}` : 'Collapse'}
        </button>
      )}
    </div>
  )
}
