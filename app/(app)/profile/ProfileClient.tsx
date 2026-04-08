'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Download, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCategoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'
import type { CategoryWithColor } from '@/types'

interface ProfileClientProps {
  user: { id: string; email: string; name: string | null; currency: string } | null
  initialCategories: CategoryWithColor[]
}

export function ProfileClient({ user, initialCategories }: ProfileClientProps) {
  const router = useRouter()
  const [name, setName] = useState(user?.name ?? '')
  const [editingName, setEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [categories] = useState<CategoryWithColor[]>(initialCategories)

  async function handleSaveName() {
    setSavingName(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setSavingName(false)
    setEditingName(false)
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleExport() {
    const res = await fetch('/api/expenses?limit=10000')
    const expenses = await res.json()
    const header = 'Date,Category,Amount,Note\n'
    const rows = expenses.map((e: { date: string; category: { name: string }; amount: number; note: string | null }) =>
      `${new Date(e.date).toLocaleDateString()},${e.category.name},${e.amount},"${e.note ?? ''}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tally-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="px-4 pt-5 pb-2 md:px-6 md:pt-6">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="px-4 md:px-6 space-y-4 pb-8 md:max-w-lg">
        {/* Account */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Account</h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Display name</p>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="p-1.5 bg-gray-900 text-white rounded-lg">
                    <Check size={14} />
                  </button>
                  <button onClick={() => { setEditingName(false); setName(user?.name ?? '') }} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900">{name || '-'}</p>
                  <button onClick={() => setEditingName(true)} className="p-1 text-gray-400 hover:text-gray-700">
                    <Pencil size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Categories</h2>
          <div className="space-y-2">
            {categories.map((cat) => {
              const color = getCategoryColor(cat.colorKey)
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', color.bg)}>
                    <span className="text-sm">{cat.icon}</span>
                  </div>
                  <p className="text-sm text-gray-900 flex-1">{cat.name}</p>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', color.bg, color.text)}>
                    {cat.colorKey}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Data */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Data</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            <Download size={16} />
            Export all expenses as CSV
          </button>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 border border-red-100 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  )
}
