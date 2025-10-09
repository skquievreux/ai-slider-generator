'use client'

import { useState } from 'react'
import { WebsiteAnalysis, ExtractedBranding } from '@/types'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [branding, setBranding] = useState<ExtractedBranding | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!url.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        // Extract branding from analysis
        extractBranding(data.analysis)
      } else {
        setError(data.details || data.error)
      }
    } catch (err) {
      setError('Failed to analyze website')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractBranding = (analysis: WebsiteAnalysis) => {
    // Simple branding extraction for demo
    const primaryColor = analysis.colors[0]?.hex || '#7C3AED'
    const secondaryColor = analysis.colors[1]?.hex || '#FF6B35'
    const accentColor = analysis.colors[2]?.hex || '#00D9D9'

    const fontFamily = analysis.fonts.find(f => f.family !== 'ui-sans-serif')?.family || 'Inter'

    setBranding({
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor: '#FFFFFF',
      textColor: '#2D2D2D',
      fontFamily,
      logoUrl: analysis.logos[0]?.url,
      brandName: analysis.brandName
    })
  }

  const handleGenerateTemplate = async () => {
    if (!analysis || !branding) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          templateName: `${branding.brandName} Template`
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Template created successfully!\n\nGoogle Slides URL: ${data.template.googleSlidesUrl}`)
      } else {
        setError(data.details || data.error)
      }
    } catch (err) {
      setError('Failed to generate template')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Template Generator Admin
        </h1>

        {/* URL Input */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Website URL</h2>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 input-field"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {isAnalyzing ? 'Analysiere...' : 'Analysieren'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Fehler:</strong> {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Website Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Website Analyse</h3>
              <div className="space-y-3">
                <div>
                  <strong>Brand Name:</strong> {analysis.brandName}
                </div>
                <div>
                  <strong>Domain:</strong> {analysis.metadata.domain}
                </div>
                <div>
                  <strong>Farben gefunden:</strong> {analysis.colors.length}
                </div>
                <div>
                  <strong>Fonts gefunden:</strong> {analysis.fonts.length}
                </div>
                <div>
                  <strong>Logos gefunden:</strong> {analysis.logos.length}
                </div>
              </div>
            </div>

            {/* Branding Preview */}
            {branding && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Extrahiertes Branding</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: branding.primaryColor }}
                    ></div>
                    <span>Primary: {branding.primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: branding.secondaryColor }}
                    ></div>
                    <span>Secondary: {branding.secondaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: branding.accentColor }}
                    ></div>
                    <span>Accent: {branding.accentColor}</span>
                  </div>
                  <div>
                    <strong>Font:</strong> {branding.fontFamily}
                  </div>
                  {branding.logoUrl && (
                    <div>
                      <strong>Logo:</strong>
                      <img src={branding.logoUrl} alt="Logo" className="w-16 h-16 object-contain mt-2" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Color Palette */}
        {analysis && analysis.colors.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Farbpalette</h3>
            <div className="flex flex-wrap gap-4">
              {analysis.colors.slice(0, 8).map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 mb-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="text-sm font-mono">{color.hex}</div>
                  <div className="text-xs text-gray-500">Usage: {color.usage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot */}
        {analysis && analysis.screenshots.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Website Screenshot</h3>
            <img
              src={analysis.screenshots[0]}
              alt="Website Screenshot"
              className="w-full max-w-4xl rounded-lg border"
            />
          </div>
        )}

        {/* Template Generation */}
        {branding && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Template Generierung</h3>
            <p className="text-gray-600 mb-4">
              Erstelle eine Google Slides Template basierend auf dem extrahierten Branding.
            </p>
            <button
              onClick={handleGenerateTemplate}
              disabled={isGenerating}
              className="btn-primary disabled:opacity-50"
            >
              {isGenerating ? 'Erstelle Template...' : 'Template erstellen'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}