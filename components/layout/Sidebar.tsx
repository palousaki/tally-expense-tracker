'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, List, PieChart, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/',             icon: Home,    label: 'Home' },
  { href: '/transactions', icon: List,    label: 'Transactions' },
  { href: '/budgets',      icon: PieChart, label: 'Budgets' },
  { href: '/stats',        icon: BarChart2, label: 'Stats' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Tally logo" width={80} height={80} className="object-contain" />
          <span className="text-2xl mt-1 font-semibold tracking-tight text-gray-900">Tally</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Profile link at bottom */}
      <div className="px-3 pb-6">
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
            pathname === '/profile'
              ? 'bg-gray-100 text-gray-900 font-semibold'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium'
          )}
        >
          Profile & settings
        </Link>
      </div>
    </aside>
  )
}
