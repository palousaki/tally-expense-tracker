import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="max-w-md mx-auto pb-24 md:max-w-none md:mx-0 md:ml-56 md:pb-0">
        {children}
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
