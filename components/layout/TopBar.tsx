'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

interface TopBarProps {
  title?: string
  userName?: string | null
  avatarUrl?: string | null
  showGreeting?: boolean
}

export function TopBar({ title, userName, avatarUrl, showGreeting }: TopBarProps) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="flex items-center justify-between px-4 pt-5 pb-2 md:px-6 md:pt-6">
      <div>
        {showGreeting ? (
          <>
            <p className="text-sm text-gray-500">{greeting},</p>
            <h1 className="text-xl font-bold text-gray-900">{userName ?? 'there'}</h1>
          </>
        ) : (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      <Link
        href="/profile"
        className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-sm font-semibold">
            {userName ? userName[0].toUpperCase() : <User size={16} className="text-white" />}
          </span>
        )}
      </Link>
    </header>
  )
}
