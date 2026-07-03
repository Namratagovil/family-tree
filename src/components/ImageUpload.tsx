'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, CheckCircle2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Person } from '@/types'
import { CONTACT_EMAIL } from '@/data/familyData'

interface ImageUploadProps {
  person: Person
  onPhotoChange: (dataUrl: string) => void
}

async function compressToSquare(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 300
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('No canvas context')); return }

      const size = Math.min(img.naturalWidth, img.naturalHeight)
      const sx = (img.naturalWidth - size) / 2
      const sy = (img.naturalHeight - size) / 2
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 300, 300)

      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/webp', 0.82))
    }

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Image load failed')) }
    img.src = objectUrl
  })
}

function exportBundle(person: Person, photoDataUrl: string) {
  const bundle = {
    generationId: person.id,
    personName: person.name,
    exportedAt: new Date().toISOString(),
    instructions: `Send this file to ${CONTACT_EMAIL} to permanently add this photo to the family tree.`,
    photoData: photoDataUrl,
  }
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `family-tree-update-${person.id}-${person.name.replace(/\s+/g, '_')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ImageUpload({ person, onPhotoChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(person.photoUrl ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [exported, setExported] = useState(false)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setIsProcessing(true)
    try {
      const dataUrl = await compressToSquare(file)
      setPreview(dataUrl)
      onPhotoChange(dataUrl)
      setExported(false)
    } catch (e) {
      console.error('Image compression failed', e)
    } finally {
      setIsProcessing(false)
    }
  }, [onPhotoChange])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleExport = () => {
    if (!preview) return
    exportBundle(person, preview)
    setExported(true)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Photo</p>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        aria-label={preview ? 'Change photo' : 'Upload a photo, click or drag a file here'}
        className={`relative w-full rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900
          ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/40 dark:hover:border-primary-light/50 hover:bg-primary/5 dark:hover:bg-primary-light/5'}
          ${preview ? 'h-36' : 'h-24'}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="h-5 w-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" aria-hidden="true" />
            <span className="text-xs">Processing…</span>
          </div>
        ) : preview ? (
          <>
            <img src={preview} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change photo</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <Upload className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs">Click or drag a photo</span>
          </div>
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-hidden="true" tabIndex={-1} />

      {/* Success + export */}
      {preview && !isProcessing && (
        <div className="rounded-xl bg-primary/5 dark:bg-primary-light/10 border border-primary/15 dark:border-primary-light/20 p-4 space-y-3">
          {!exported ? (
            <>
              <p className="text-sm text-primary dark:text-primary-light font-medium leading-snug">
                Looking good! Click below to download your update bundle, then send it to{' '}
                <strong>Namrata</strong> via email/WhatsApp to permanently add it to the family tree.
              </p>
              <Button
                variant="default"
                size="sm"
                className="w-full gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export Update Bundle
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-primary dark:text-primary-light">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium">
                Bundle downloaded! Send it to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-fg dark:focus-visible:ring-offset-gray-900 rounded">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
