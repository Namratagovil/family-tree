'use client'

import React, { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Person } from '@/types'
import { getInitials, getBranchColor } from '@/lib/utils'

interface ListViewProps {
  members: Person[]
  selectedId: string | null
  onSelectPerson: (person: Person) => void
}

interface ListNodeProps {
  person: Person
  allMembers: Person[]
  selectedId: string | null
  onSelect: (p: Person) => void
  depth: number
}

function ListNode({ person, allMembers, selectedId, onSelect, depth }: ListNodeProps) {
  const children = allMembers.filter(m => m.parentId === person.id)
  const color = getBranchColor(person.id)
  const initials = getInitials(person.name)
  const isSelected = selectedId === person.id
  const isUnknown = person.name === 'Unknown' || person.name === ''

  const avatar = person.photoUrl ? (
    <img src={person.photoUrl} alt={person.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {isUnknown ? '?' : initials}
    </div>
  )

  const label = (
    <div className="flex items-center gap-2.5 flex-1 min-w-0">
      {avatar}
      <div className="flex-1 min-w-0 text-left">
        <div className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
          {isUnknown ? '—' : person.name}
        </div>
        <div className="text-[10px] text-gray-400 font-mono">{person.id}</div>
      </div>
    </div>
  )

  if (children.length === 0) {
    return (
      <div
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className={`flex items-center gap-2 py-2 pr-4 cursor-pointer rounded-lg mx-2 transition-colors
          ${isSelected ? 'bg-primary/8' : 'hover:bg-gray-50'}`}
        onClick={() => onSelect(person)}
      >
        <div className="w-4 h-px bg-gray-200 flex-shrink-0" />
        {label}
      </div>
    )
  }

  return (
    <AccordionItem value={person.id} className="border-none">
      <div
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className={`flex items-center mx-2 rounded-lg transition-colors ${isSelected ? 'bg-primary/8' : 'hover:bg-gray-50'}`}
      >
        <AccordionTrigger
          className="flex-1 py-2 pr-2 hover:no-underline"
          onClick={() => onSelect(person)}
        >
          {label}
        </AccordionTrigger>
      </div>
      <AccordionContent className="pb-0">
        <Accordion type="multiple" className="w-full">
          {children.map(child => (
            <ListNode
              key={child.id}
              person={child}
              allMembers={allMembers}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function ListView({ members, selectedId, onSelectPerson }: ListViewProps) {
  const root = useMemo(() => members.find(m => m.id === '1'), [members])

  if (!root) return null

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto py-4 px-2">
        <Accordion type="multiple" defaultValue={['1', '11', '12']} className="w-full">
          <ListNode
            person={root}
            allMembers={members}
            selectedId={selectedId}
            onSelect={onSelectPerson}
            depth={0}
          />
        </Accordion>
      </div>
    </div>
  )
}
