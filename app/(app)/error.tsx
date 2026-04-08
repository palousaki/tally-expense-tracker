'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  )
}
