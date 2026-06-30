import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kunwar Sain Family Tree',
  description: 'Interactive family tree — Kunwar Sain lineage across 6 generations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  )
}
