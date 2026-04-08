'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, PieChart, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/',             icon: Home,    label: 'Home' },
  { href: '/transactions', icon: List,    label: 'Transactions' },
  { href: '/budgets',      icon: PieChart, label: 'Budgets' },
  { href: '/stats',        icon: BarChart2, label: 'Stats' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors',
                active ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn('font-medium', active ? 'text-gray-900' : 'text-gray-400')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
