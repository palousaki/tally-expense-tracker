'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number       // 0–100
  barClass?: string   // Tailwind bg class e.g. 'bg-purple-500'
  className?: string
  overBudget?: boolean
}

export function ProgressBar({ value, barClass = 'bg-gray-400', className, overBudget }: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      requestAnimationFrame(() => setWidth(Math.min(value, 100)))
    } else {
      setWidth(Math.min(value, 100))
    }
  }, [value])

  return (
    <div className={cn('h-1.5 w-full rounded-full bg-gray-100 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-600 ease-out', overBudget ? 'bg-red-500' : barClass)}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
