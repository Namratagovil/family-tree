'use client'

import React, { useState } from 'react'
import { AlertCircle, Users } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/ImageUpload'
import { Person } from '@/types'
import { getInitials, getBranchColor } from '@/lib/utils'
import { CONTACT_EMAIL, FAMILY_MEMBERS } from '@/data/familyData'

interface ProfileSheetProps {
  person: Person | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPhotoUpdate: (id: string, photoUrl: string) => void
}

function buildMailtoLink(person: Person): string {
  const subject = encodeURIComponent(
    `Family Tree Update Request: ${person.name} (${person.id})`
  )
  const body = encodeURIComponent(
    `Hi,\n\nI noticed some missing connections for ${person.name} (ID: ${person.id}) in the family tree.\n\nMissing connection details:\n[Please type the missing relative(s) here — e.g. "Missing spouse: Name", "Missing child: Name", "Missing parent: Name"]\n\nRelationship type: [ ] Spouse  [ ] Child  [ ] Parent  [ ] Sibling\n\nThank you!`
  )
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

function getRelatives(person: Person) {
  const parent = person.parentId ? FAMILY_MEMBERS.find(m => m.id === person.parentId) : null
  const children = FAMILY_MEMBERS.filter(m => m.parentId === person.id)
  const siblings = person.parentId
    ? FAMILY_MEMBERS.filter(m => m.parentId === person.parentId && m.id !== person.id)
    : []
  return { parent, children, siblings }
}

export default function ProfileSheet({ person, open, onOpenChange, onPhotoUpdate }: ProfileSheetProps) {
  const [localPhoto, setLocalPhoto] = useState<string | null>(null)

  if (!person) return null

  const color = getBranchColor(person.id)
  const initials = getInitials(person.name)
  const { parent, children, siblings } = getRelatives(person)
  const mailto = buildMailtoLink(person)
  const photoSrc = localPhoto ?? person.photoUrl ?? null

  const handlePhotoChange = (dataUrl: string) => {
    setLocalPhoto(dataUrl)
    onPhotoUpdate(person.id, dataUrl)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) setLocalPhoto(null); onOpenChange(o) }}>
      <SheetContent>
        <SheetHeader>
          {/* Avatar */}
          <div className="flex items-center gap-4 pt-2">
            <div className="relative">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ outline: `2.5px solid ${color}`, outlineOffset: '2px' }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-white border border-gray-200 rounded-full px-1.5 py-0.5 font-mono text-gray-500 shadow-sm">
                {person.id}
              </span>
            </div>
            <div>
              <SheetTitle>{person.name}</SheetTitle>
              <SheetDescription>
                Generation {person.generation}
                {person.spouse && ` · Spouse: ${person.spouse}`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Family connections */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Family</p>
            <div className="rounded-xl bg-gray-50 divide-y divide-gray-100">
              {parent && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">Parent</span>
                  <span className="text-sm font-medium text-gray-800">{parent.name}</span>
                </div>
              )}
              {person.spouse && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">Spouse</span>
                  <span className="text-sm font-medium text-gray-800">{person.spouse}</span>
                </div>
              )}
              {children.length > 0 && (
                <div className="px-4 py-2.5 space-y-1">
                  <span className="text-xs text-gray-500">
                    {children.length === 1 ? 'Child' : `Children (${children.length})`}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {children.map(c => (
                      <span
                        key={c.id}
                        className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-700"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {siblings.length > 0 && (
                <div className="px-4 py-2.5 space-y-1">
                  <span className="text-xs text-gray-500">
                    Siblings ({siblings.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {siblings.map(s => (
                      <span
                        key={s.id}
                        className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-700"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo upload */}
          <ImageUpload person={person} onPhotoChange={handlePhotoChange} />

          {/* Missing connections */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-gray-700 font-medium">Notice missing relatives or broken connections?</p>
              <Button variant="accent" size="sm" asChild>
                <a href={mailto}>
                  <Users className="h-4 w-4" />
                  Report Missing Connection
                </a>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
