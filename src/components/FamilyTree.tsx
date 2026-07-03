'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  Network,
  List,
  TreePine,
  Sun,
  Moon,
  ArrowDownToLine,
  ArrowUpToLine,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronsDown,
  ChevronsUp,
} from 'lucide-react'
import { FAMILY_MEMBERS } from '@/data/familyData'
import { useViewMode } from '@/hooks/useViewMode'
import { useTheme } from '@/hooks/useTheme'
import { getDefaultCollapsedIds } from '@/lib/treeLayout'
import { Person, LayoutDirection, LayoutAlignment } from '@/types'
import CanvasView from './CanvasView'
import ListView from './ListView'
import ProfileSheet from './ProfileSheet'

const DIRECTION_OPTIONS: { value: LayoutDirection; label: string; icon: typeof ArrowDownToLine }[] = [
  { value: 'top-down', label: 'Top Down', icon: ArrowDownToLine },
  { value: 'bottom-up', label: 'Bottom Up', icon: ArrowUpToLine },
]

const ALIGNMENT_OPTIONS: { value: LayoutAlignment; label: string; icon: typeof AlignLeft }[] = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
]

export default function FamilyTree() {
  const { viewMode, setViewMode } = useViewMode()
  const { theme, toggleTheme } = useTheme()
  const [members, setMembers] = useState<Person[]>(FAMILY_MEMBERS)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [direction, setDirection] = useState<LayoutDirection>('top-down')
  const [alignment, setAlignment] = useState<LayoutAlignment>('center')
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => getDefaultCollapsedIds(FAMILY_MEMBERS))

  const allParentIds = useMemo(
    () => new Set(members.filter(m => members.some(c => c.parentId === m.id)).map(m => m.id)),
    [members]
  )

  const handleSelectPerson = useCallback((person: Person) => {
    setSelectedPerson(person)
    setSheetOpen(true)
  }, [])

  const handlePhotoUpdate = useCallback((id: string, photoUrl: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, photoUrl } : m))
    )
  }, [])

  const handleToggleCollapse = useCallback((id: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = useCallback(() => setCollapsedIds(new Set()), [])
  const collapseAll = useCallback(() => setCollapsedIds(new Set(allParentIds)), [allParentIds])

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <TreePine className="h-6 w-6 text-primary dark:text-primary-light flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 leading-tight truncate">Kunwar Sain Family Tree</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{members.length} members · 6 generations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1" role="group" aria-label="View mode">
              <button
                onClick={() => setViewMode('canvas')}
                aria-pressed={viewMode === 'canvas'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900
                  ${viewMode === 'canvas'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-primary-light'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                <Network className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Canvas</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900
                  ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-primary-light'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'}`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar: legend + layout mode controls */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 px-4 py-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        {[
          { label: 'Jupad Sain branch', color: '#B4D4CF' },
          { label: 'Bhola Nath branch', color: '#D2BF96' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            <span className="text-[11px] text-gray-600 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-0.5 rounded-full bg-primary dark:bg-primary-light" aria-hidden="true" />
          <span className="text-[11px] text-gray-600 dark:text-gray-300">Family connection</span>
        </div>

        {viewMode === 'canvas' && (
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1" role="group" aria-label="Layout direction">
              {DIRECTION_OPTIONS.map(opt => {
                const Icon = opt.icon
                const active = direction === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDirection(opt.value)}
                    aria-pressed={active}
                    aria-label={opt.label}
                    title={opt.label}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900
                      ${active
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-primary-light'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden md:inline">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1" role="group" aria-label="Sibling alignment">
              {ALIGNMENT_OPTIONS.map(opt => {
                const Icon = opt.icon
                const active = alignment === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAlignment(opt.value)}
                    aria-pressed={active}
                    aria-label={opt.label}
                    title={opt.label}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900
                      ${active
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-primary-light'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden md:inline">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1" role="group" aria-label="Expand or collapse all">
              <button
                onClick={expandAll}
                aria-label="Expand all"
                title="Expand all"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
              >
                <ChevronsDown className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Expand All</span>
              </button>
              <button
                onClick={collapseAll}
                aria-label="Collapse all"
                title="Collapse all"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900"
              >
                <ChevronsUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Collapse All</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-0 min-w-0 relative">
        {viewMode === 'canvas' ? (
          <CanvasView
            members={members}
            selectedId={selectedPerson?.id ?? null}
            onSelectPerson={handleSelectPerson}
            direction={direction}
            alignment={alignment}
            theme={theme}
            collapsedIds={collapsedIds}
            onToggleCollapse={handleToggleCollapse}
          />
        ) : (
          <ListView
            members={members}
            selectedId={selectedPerson?.id ?? null}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </main>

      {/* Profile sheet */}
      <ProfileSheet
        person={selectedPerson}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </div>
  )
}
