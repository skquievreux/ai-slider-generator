'use client'

import { useState } from 'react'
import { usePresentationStore } from '@/lib/store'

export function ExportButtons() {
  const { generatedSlides, exportUrls, setExportUrls } = usePresentationStore()
  const [isExporting, setIsExporting] = useState<string | null>(null)

  if (generatedSlides.length === 0) return null

  const handleCreatePresentation = async () => {
    setIsExporting('google')
    try {
      const response = await fetch('/api/create-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides: generatedSlides }),
      })

      if (!response.ok) {
        throw new Error('Failed to create presentation')
      }

      const data = await response.json()
      setExportUrls({ googleSlides: data.googleSlidesUrl })
    } catch (error) {
      console.error('Error creating presentation:', error)
      alert('Fehler beim Erstellen der Präsentation.')
    } finally {
      setIsExporting(null)
    }
  }

  const handleExport = async (format: 'pdf' | 'pptx') => {
    if (!exportUrls.googleSlides) {
      alert('Bitte erstellen Sie die Google Slides Präsentation.')
      return
    }

    setIsExporting(format)
    try {
      const response = await fetch(`/api/export/${exportUrls.googleSlides.split('/').pop()}/${format}`)

      if (!response.ok) {
        throw new Error(`Failed to export ${format.toUpperCase()}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presentation.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      alert(`Fehler beim Export als ${format.toUpperCase()}.`)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Export & Teilen</h3>

      <div className="space-y-3">
        <button
          onClick={handleCreatePresentation}
          disabled={isExporting === 'google'}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting === 'google' ? 'Erstelle Google Slides...' : 'Google Slides erstellen'}
        </button>

        {exportUrls.googleSlides && (
          <a
            href={exportUrls.googleSlides}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center block"
          >
            In Google Slides öffnen
          </a>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting === 'pdf' || !exportUrls.googleSlides}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting === 'pdf' ? 'Exportiere...' : 'PDF Export'}
          </button>

          <button
            onClick={() => handleExport('pptx')}
            disabled={isExporting === 'pptx' || !exportUrls.googleSlides}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting === 'pptx' ? 'Exportiere...' : 'PPTX Export'}
          </button>
        </div>
      </div>
    </div>
  )
}