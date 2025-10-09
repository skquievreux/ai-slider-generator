'use client'

import { useState } from 'react'
import { usePresentationStore } from '@/lib/store'
import { Slide } from '@/types'

export function SlidePreview() {
  const { generatedSlides } = usePresentationStore()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  if (generatedSlides.length === 0) return null

  const currentSlide = generatedSlides[currentSlideIndex]

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, generatedSlides.length - 1))
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))
  }

  const renderSlideContent = (slide: Slide) => {
    return (
      <div className="p-8 h-full flex flex-col">
        {slide.content.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {slide.content.title}
          </h2>
        )}

        {slide.content.body && (
          <div className="flex-1">
            <ul className="space-y-3">
              {slide.content.body.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 text-xl">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {slide.content.image && (
          <div className="mt-6">
            <img
              src={slide.content.image.url}
              alt={slide.content.image.alt}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Folien-Vorschau
          </h3>
          <span className="text-sm text-gray-500">
            {currentSlideIndex + 1} von {generatedSlides.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-video bg-white border-2 border-gray-200 rounded-lg mx-6 my-6 overflow-hidden">
          {renderSlideContent(currentSlide)}
        </div>

        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Vorherige
          </button>

          <div className="flex space-x-2">
            {generatedSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlideIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === generatedSlides.length - 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Nächste →
          </button>
        </div>
      </div>
    </div>
  )
}