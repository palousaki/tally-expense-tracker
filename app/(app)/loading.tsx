import { DashboardSkeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <>
      {/* TopBar placeholder */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2 md:px-6 md:pt-6">
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded-md bg-gray-100 animate-pulse" />
          <div className="h-5 w-32 rounded-md bg-gray-100 animate-pulse" />
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
      </div>
      <DashboardSkeleton />
    </>
  )
}
