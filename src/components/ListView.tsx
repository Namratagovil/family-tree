'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Accordion, AccordionItem, AccordionContent } from '@/components/ui/accordion'
import { Person } from '@/types'
import { getInitials, getBranchColor, getContrastTextColor } from '@/lib/utils'

interface ListViewProps {
  members: Person[]
  selectedId: string | null
  onSelectPerson: (person: Person) => void
}

interface ExpandedChildrenProps {
  children: React.ReactNode
  hasMountedRef: React.MutableRefObject<boolean>
}

// Radix unmounts AccordionContent while collapsed, so this remounts every time a
// node expands — moving focus there, but not on the tree's initial render.
function ExpandedChildren({ children, hasMountedRef }: ExpandedChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasMountedRef.current) {
      ref.current?.querySelector<HTMLElement>('button')?.focus()
    }
  }, [hasMountedRef])

  return <div ref={ref}>{children}</div>
}

interface ListNodeProps {
  person: Person
  allMembers: Person[]
  selectedId: string | null
  onSelect: (p: Person) => void
  depth: number
  hasMountedRef: React.MutableRefObject<boolean>
  openIds: string[]
  onToggleOpen: (id: string) => void
}

function ListNode({ person, allMembers, selectedId, onSelect, depth, hasMountedRef, openIds, onToggleOpen }: ListNodeProps) {
  const children = allMembers.filter(m => m.parentId === person.id)
  const color = getBranchColor(person.id)
  const initials = getInitials(person.name)
  const isSelected = selectedId === person.id
  const isUnknown = person.name === 'Unknown' || person.name === ''
  const isOpen = openIds.includes(person.id)

  const avatarTextColor = getContrastTextColor(color)

  const avatar = person.photoUrl ? (
    <img src={person.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: color, color: avatarTextColor }}
    >
      {isUnknown ? '?' : initials}
    </div>
  )

  const label = (
    <div className="flex items-center gap-2.5 flex-1 min-w-0">
      {avatar}
      <div className="flex-1 min-w-0 text-left">
        <div className={`text-sm font-semibold truncate ${isSelected ? 'text-primary dark:text-primary-light' : 'text-gray-800 dark:text-gray-100'}`}>
          {isUnknown ? '—' : person.name}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{person.id}</div>
      </div>
    </div>
  )

  const ariaLabel = `${isUnknown ? 'Unknown' : person.name}, ID ${person.id}, generation ${person.generation}${isSelected ? ', selected' : ''}`

  if (children.length === 0) {
    return (
      <button
        type="button"
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className={`flex items-center gap-2 py-2 pr-4 w-full text-left rounded-lg mx-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-fg dark:focus-visible:ring-accent-fgDark
          ${isSelected ? 'bg-primary/8 dark:bg-primary-light/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        onClick={() => onSelect(person)}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
      >
        <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 flex-shrink-0" aria-hidden="true" />
        {label}
      </button>
    )
  }

  return (
    <AccordionItem value={person.id} className="border-none">
      <div
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className={`flex items-start mx-2 rounded-lg transition-colors ${isSelected ? 'bg-primary/8 dark:bg-primary-light/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      >
        <button
          type="button"
          className="flex-1 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-fg dark:focus-visible:ring-accent-fgDark rounded-lg"
          onClick={() => onSelect(person)}
          aria-label={ariaLabel}
        >
          {label}
        </button>
        <button
          type="button"
          className="flex items-start gap-3 py-2 pr-2 pl-1 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-fg dark:focus-visible:ring-accent-fgDark rounded-lg"
          onClick={() => onToggleOpen(person.id)}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${isUnknown ? 'Unknown' : person.name}'s children`}
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>
      <AccordionContent className="pb-0">
        <ExpandedChildren hasMountedRef={hasMountedRef}>
          <Accordion type="multiple" value={openIds} onValueChange={onValueChangeNoop} className="w-full">
            {children.map(child => (
              <ListNode
                key={child.id}
                person={child}
                allMembers={allMembers}
                selectedId={selectedId}
                onSelect={onSelect}
                depth={depth + 1}
                hasMountedRef={hasMountedRef}
                openIds={openIds}
                onToggleOpen={onToggleOpen}
              />
            ))}
          </Accordion>
        </ExpandedChildren>
      </AccordionContent>
    </AccordionItem>
  )
}

function onValueChangeNoop() {
  // Open/close state is driven entirely by the chevron buttons via onToggleOpen,
  // not by Radix's own trigger — there is none, since the chevron is a separate
  // control from the row's select button.
}

export default function ListView({ members, selectedId, onSelectPerson }: ListViewProps) {
  const root = useMemo(() => members.find(m => m.id === '1'), [members])
  const hasMountedRef = useRef(false)
  const [openIds, setOpenIds] = useState<string[]>(['1', '11', '12'])

  const handleToggleOpen = useCallback((id: string) => {
    setOpenIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }, [])

  useEffect(() => {
    hasMountedRef.current = true
  }, [])

  if (!root) return null

  return (
    <div className="w-full h-full overflow-y-auto bg-background dark:bg-gray-950">
      <div className="max-w-2xl mx-auto py-4 px-2">
        <Accordion type="multiple" value={openIds} onValueChange={onValueChangeNoop} className="w-full">
          <ListNode
            person={root}
            allMembers={members}
            selectedId={selectedId}
            onSelect={onSelectPerson}
            depth={0}
            hasMountedRef={hasMountedRef}
            openIds={openIds}
            onToggleOpen={handleToggleOpen}
          />
        </Accordion>
      </div>
    </div>
  )
}
