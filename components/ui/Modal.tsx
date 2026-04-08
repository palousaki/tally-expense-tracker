'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Mobile: bottom sheet - Desktop: centered dialog */}
      <div
        className={[
          'relative w-full bg-white shadow-xl max-h-[90vh] overflow-y-auto',
          // Mobile: bottom sheet shape + slide-up
          'rounded-t-2xl',
          // Desktop: centered dialog shape + fade-in
          'md:rounded-2xl md:max-w-lg',
        ].join(' ')}
        style={{ animation: 'modalIn 250ms ease' }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 md:px-6 md:pt-5">
          {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          @keyframes modalIn {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  )
}
