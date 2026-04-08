import { ChartSkeleton } from '@/components/ui/Skeleton'

export default function StatsLoading() {
  return (
    <>
      <div className="px-4 pt-5 pb-4 md:px-6 md:pt-6">
        <div className="h-6 w-16 rounded-lg bg-gray-100 animate-pulse" />
      </div>
      <div className="px-4 md:px-6 mb-4">
        <div className="h-9 w-56 rounded-xl bg-gray-100 animate-pulse" />
      </div>
      <ChartSkeleton />
    </>
  )
}
