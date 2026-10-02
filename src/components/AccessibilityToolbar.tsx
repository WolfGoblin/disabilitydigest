'use client'

import React, { useState, useEffect } from 'react'
import { Eye, ZoomIn, ZoomOut, RotateCcw, Volume2 } from 'lucide-react'

export function AccessibilityToolbar() {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(100)

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', `${fontSize}%`)
  }, [fontSize])

  const handleTextSizeChange = (delta: number) => {
    setFontSize((prev) => Math.min(Math.max(prev + delta, 90), 160))
  }

  const resetAccessibility = () => {
    setHighContrast(false)
    setFontSize(100)
  }

  return (
    <aside
      aria-label="Accessibility options"
      className="bg-brand-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-brand-800"
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="bg-brand-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">WCAG 2.1 AA</span>
        <span>Accessibility Tools:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition font-semibold ${
            highContrast ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-brand-800 hover:bg-brand-700 border-brand-600 text-white'
          }`}
          aria-pressed={highContrast}
          aria-label="Toggle high contrast mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{highContrast ? 'Standard Contrast' : 'High Contrast'}</span>
        </button>

        {/* Font Resizing */}
        <div className="flex items-center bg-brand-800 rounded border border-brand-600 overflow-hidden" role="group" aria-label="Text size adjustment">
          <button
            onClick={() => handleTextSizeChange(-10)}
            className="px-2 py-1 hover:bg-brand-700 border-r border-brand-600 flex items-center gap-1 font-bold"
            aria-label="Decrease text size"
            title="Decrease text size"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>A-</span>
          </button>
          <span className="px-2 text-[11px] font-mono font-bold">{fontSize}%</span>
          <button
            onClick={() => handleTextSizeChange(10)}
            className="px-2 py-1 hover:bg-brand-700 flex items-center gap-1 font-bold"
            aria-label="Increase text size"
            title="Increase text size"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>A+</span>
          </button>
        </div>

        {/* Reset button */}
        {(highContrast || fontSize !== 100) && (
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs"
            aria-label="Reset accessibility settings"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </aside>
  )
}
