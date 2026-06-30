'use client'

import React, { useState, useCallback } from 'react'
import { Network, List, TreePine } from 'lucide-react'
import { FAMILY_MEMBERS } from '@/data/familyData'
import { useViewMode } from '@/hooks/useViewMode'
import { Person } from '@/types'
import CanvasView from './CanvasView'
import ListView from './ListView'
import ProfileSheet from './ProfileSheet'

export default function FamilyTree() {
  const { viewMode, setViewMode } = useViewMode()
  const [members, setMembers] = useState<Person[]>(FAMILY_MEMBERS)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleSelectPerson = useCallback((person: Person) => {
    setSelectedPerson(person)
    setSheetOpen(true)
  }, [])

  const handlePhotoUpdate = useCallback((id: string, photoUrl: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, photoUrl } : m))
    )
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TreePine className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Kunwar Sain Family Tree</h1>
              <p className="text-[10px] text-gray-400 leading-tight">{members.length} members · 6 generations</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${viewMode === 'canvas'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Network className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${viewMode === 'list'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </header>

      {/* Legend strip */}
      <div className="flex-shrink-0 bg-white border-b border-gray-50 px-4 py-2 flex items-center gap-4 overflow-x-auto">
        {[
          { label: 'Jupad Sain branch', color: '#B4D4CF' },
          { label: 'Bhola Nath branch', color: '#D2BF96' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-gray-500">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <div className="w-3 h-px bg-primary opacity-45" style={{ background: 'linear-gradient(to right, #004C2B, #004C2B)' }} />
          <span className="text-[11px] text-gray-500">Family connection</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-0 relative">
        {viewMode === 'canvas' ? (
          <CanvasView
            members={members}
            selectedId={selectedPerson?.id ?? null}
            onSelectPerson={handleSelectPerson}
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
