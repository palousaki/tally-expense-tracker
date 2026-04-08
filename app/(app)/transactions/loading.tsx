import { ListSkeleton } from '@/components/ui/Skeleton'

export default function TransactionsLoading() {
  return (
    <>
      <div className="px-4 pt-5 pb-4 md:px-6 md:pt-6">
        <div className="h-6 w-32 rounded-lg bg-gray-100 animate-pulse" />
      </div>
      {/* Filter bar placeholder */}
      <div className="px-4 md:px-6 mb-4 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-100 animate-pulse" />
        ))}
      </div>
      <ListSkeleton rows={8} />
    </>
  )
}
