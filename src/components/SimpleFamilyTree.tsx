'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FAMILY_MEMBERS, CONTACT_EMAIL } from '@/data/familyData'
import { Person } from '@/types'
import { getBranchColor } from '@/lib/utils'

const ROOT_ID = '1'
// Root font size in px. At 12.8px the smallest text on screen (text-xl, 1.25rem) is 16px.
const TEXT_SIZES = [12.8, 16, 20, 24, 28, 32]
const DEFAULT_SIZE_INDEX = 3
const SIZE_STORAGE_KEY = 'family-tree-text-size-px'

type Screen = { kind: 'person'; id: string } | { kind: 'everyone' }

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

function displayName(person: Person): string {
  return person.name === 'Unknown' ? 'Name not known' : person.name
}

function childCountLabel(count: number): string {
  if (count === 0) return ''
  return count === 1 ? '1 child' : `${count} children`
}

function mailtoFor(person: Person): string {
  const subject = encodeURIComponent(`Family Tree Update Request: ${person.name} (${person.id})`)
  const body = encodeURIComponent(
    `Hello,\n\nSomeone is missing from the family tree near ${person.name} (ID: ${person.id}).\n\nWho is missing, and how are they related?\n\n`
  )
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

interface TileProps {
  person: Person
  childCount: number
  onOpen: (id: string) => void
}

function PersonTile({ person, childCount, onOpen }: TileProps) {
  const label = childCountLabel(childCount)
  return (
    <button
      onClick={() => onOpen(person.id)}
      className={`min-h-[8rem] w-full rounded-2xl border-4 border-gray-800 p-5 text-left text-black shadow-md active:translate-y-0.5 ${FOCUS}`}
      style={{ backgroundColor: getBranchColor(person.id) }}
    >
      <span className="block text-3xl font-bold leading-tight">{displayName(person)}</span>
      {person.spouse && (
        <span className="mt-1 block text-xl leading-snug">Husband or wife: {person.spouse}</span>
      )}
      <span className="mt-2 block text-xl font-semibold">
        {label ? `${label}. Press to open` : 'Press to open'}
      </span>
    </button>
  )
}

interface BarButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  pressed?: boolean
}

function BarButton({ children, onClick, disabled, pressed }: BarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`min-h-[4.5rem] flex-1 basis-40 rounded-xl border-4 px-4 text-2xl font-bold ${FOCUS}
        ${disabled
          ? 'cursor-not-allowed border-gray-600 bg-gray-600 text-gray-300'
          : pressed
            ? 'border-yellow-300 bg-yellow-300 text-black'
            : 'border-white bg-white text-black'}`}
    >
      {children}
    </button>
  )
}

export default function SimpleFamilyTree() {
  const [history, setHistory] = useState<Screen[]>([{ kind: 'person', id: ROOT_ID }])
  const [sizeIndex, setSizeIndex] = useState(DEFAULT_SIZE_INDEX)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const screen = history[history.length - 1]

  const byId = useMemo(() => new Map(FAMILY_MEMBERS.map(m => [m.id, m])), [])
  const childrenOf = useMemo(() => {
    const map = new Map<string, Person[]>()
    for (const m of FAMILY_MEMBERS) {
      if (m.parentId) map.set(m.parentId, [...(map.get(m.parentId) ?? []), m])
    }
    return map
  }, [])
  const countFor = useCallback((id: string) => childrenOf.get(id)?.length ?? 0, [childrenOf])

  useEffect(() => {
    try {
      const stored = TEXT_SIZES.indexOf(Number(localStorage.getItem(SIZE_STORAGE_KEY)))
      if (stored >= 0) setSizeIndex(stored)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${TEXT_SIZES[sizeIndex]}px`
    try {
      localStorage.setItem(SIZE_STORAGE_KEY, String(TEXT_SIZES[sizeIndex]))
    } catch {}
  }, [sizeIndex])

  useEffect(() => {
    if (!sizeError) return
    const timer = setTimeout(() => setSizeError(null), 4000)
    return () => clearTimeout(timer)
  }, [sizeError])

  const changeSize = useCallback(
    (step: 1 | -1) => {
      const next = sizeIndex + step
      if (next < 0 || next >= TEXT_SIZES.length) {
        const direction = step < 0 ? 'smaller' : 'bigger'
        return setSizeError(`Cannot make the text ${direction}. This is the ${step < 0 ? 'smallest' : 'biggest'} size.`)
      }
      setSizeError(null)
      setSizeIndex(next)
    },
    [sizeIndex]
  )

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [history.length, screen])

  const go = useCallback((next: Screen) => setHistory(h => [...h, next]), [])
  const openPerson = useCallback((id: string) => go({ kind: 'person', id }), [go])
  const goBack = useCallback(() => setHistory(h => (h.length > 1 ? h.slice(0, -1) : h)), [])
  const goHome = useCallback(() => setHistory([{ kind: 'person', id: ROOT_ID }]), [])

  const person = screen.kind === 'person' ? byId.get(screen.id) ?? null : null
  const parent = person?.parentId ? byId.get(person.parentId) ?? null : null
  const children = person ? childrenOf.get(person.id) ?? [] : []
  const siblings = person?.parentId
    ? (childrenOf.get(person.parentId) ?? []).filter(m => m.id !== person.id)
    : []
  // Tree order: oldest ancestor first, each person followed by their own descendants.
  const everyone = useMemo(() => {
    const ordered: Person[] = []
    const visit = (m: Person) => {
      ordered.push(m)
      ;(childrenOf.get(m.id) ?? []).forEach(visit)
    }
    FAMILY_MEMBERS.filter(m => !m.parentId).forEach(visit)
    return ordered
  }, [childrenOf])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F1EA', color: '#111' }}>
      <header className="sticky top-0 z-10 border-b-8 border-black bg-gray-800 p-3">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-3">
          <BarButton onClick={goBack} disabled={history.length <= 1}>Go Back</BarButton>
          <BarButton onClick={goHome}>Start Again</BarButton>
          <BarButton onClick={() => go({ kind: 'everyone' })} pressed={screen.kind === 'everyone'}>
            Everyone
          </BarButton>
        </div>
        <div className="mx-auto mt-3 flex max-w-5xl flex-wrap items-center gap-3">
          <span className="text-2xl font-bold text-white">Text size:</span>
          <BarButton onClick={() => changeSize(-1)}>Smaller Text</BarButton>
          <BarButton onClick={() => changeSize(1)}>Bigger Text</BarButton>
        </div>
        <div role="alert" aria-live="assertive" className="mx-auto max-w-5xl">
          {sizeError && (
            <p className="mt-3 rounded-xl border-4 border-red-300 bg-red-700 p-3 text-2xl font-bold text-white">
              {sizeError}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 p-4 pb-16">
        {screen.kind === 'everyone' && (
          <section aria-labelledby="everyone-title" className="space-y-5">
            <h1 id="everyone-title" className="text-4xl font-bold">Everyone in the family</h1>
            <p className="text-2xl">Press a name to see that person. Names are in family order, oldest at the top.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {everyone.map(m => (
                <PersonTile key={m.id} person={m} childCount={countFor(m.id)} onOpen={openPerson} />
              ))}
            </div>
          </section>
        )}

        {person && (
          <>
            <section aria-labelledby="person-title" className="space-y-3">
              <p className="text-2xl font-semibold">You are looking at</p>
              <div
                className="rounded-3xl border-8 border-gray-800 p-6"
                style={{ backgroundColor: getBranchColor(person.id) }}
              >
                <h1 id="person-title" className="text-5xl font-bold leading-tight">{displayName(person)}</h1>
                {person.spouse && (
                  <p className="mt-3 text-3xl">Husband or wife: <strong>{person.spouse}</strong></p>
                )}
                <p className="mt-3 text-2xl">Generation {person.generation}</p>
              </div>
            </section>

            {parent && (
              <section aria-labelledby="parent-title" className="space-y-4">
                <h2 id="parent-title" className="text-4xl font-bold">Parent</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PersonTile person={parent} childCount={countFor(parent.id)} onOpen={openPerson} />
                </div>
              </section>
            )}

            <section aria-labelledby="children-title" className="space-y-4">
              <h2 id="children-title" className="text-4xl font-bold">
                {children.length === 0
                  ? 'Children'
                  : children.length === 1 ? 'Child' : `Children (${children.length})`}
              </h2>
              {children.length === 0 ? (
                <p className="text-2xl">No children are listed for {displayName(person)}.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {children.map(c => (
                    <PersonTile key={c.id} person={c} childCount={countFor(c.id)} onOpen={openPerson} />
                  ))}
                </div>
              )}
            </section>

            {siblings.length > 0 && (
              <section aria-labelledby="siblings-title" className="space-y-4">
                <h2 id="siblings-title" className="text-4xl font-bold">
                  Brothers and Sisters ({siblings.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {siblings.map(s => (
                    <PersonTile key={s.id} person={s} childCount={countFor(s.id)} onOpen={openPerson} />
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="missing-title" className="space-y-4 border-t-4 border-gray-400 pt-8">
              <h2 id="missing-title" className="text-3xl font-bold">Is someone missing?</h2>
              <a
                href={mailtoFor(person)}
                className={`block min-h-[5rem] rounded-2xl border-4 border-black bg-white p-5 text-center text-3xl font-bold text-black ${FOCUS}`}
              >
                Tell us who is missing
              </a>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
