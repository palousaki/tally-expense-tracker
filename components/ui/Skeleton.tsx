import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-gray-100', className)} />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6 md:pb-6 md:items-start">
      <div className="space-y-4">
        {/* Budget card */}
        <Skeleton className="mx-4 md:mx-0 h-36 rounded-2xl" />
        {/* Category label */}
        <Skeleton className="mx-4 md:mx-0 h-4 w-28 rounded-lg" />
        {/* Category rows */}
        <div className="mx-4 md:mx-0 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <div>
        {/* Recent transactions */}
        <div className="mx-4 md:mx-0 mt-4 md:mt-0">
          <Skeleton className="h-4 w-16 rounded-lg mb-3" />
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32 rounded-md" />
                  <Skeleton className="h-2.5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3 w-14 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-36 rounded-md" />
            <Skeleton className="h-2.5 w-20 rounded-md" />
          </div>
          <Skeleton className="h-3 w-14 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="px-4 md:px-6 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[...Array(cards)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-2.5 w-16 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="mx-4 md:mx-6 bg-white rounded-2xl border border-gray-100 p-4 md:p-6 space-y-4">
      <Skeleton className="h-52 w-full rounded-xl" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="w-2.5 h-2.5 rounded-full" />
          <Skeleton className="h-3 flex-1 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      ))}
    </div>
  )
}
