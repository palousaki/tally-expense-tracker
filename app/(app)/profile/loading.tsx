import { Skeleton } from '@/components/ui/Skeleton'

export default function ProfileLoading() {
  return (
    <>
      <div className="px-4 pt-5 pb-4 md:px-6 md:pt-6">
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="px-4 md:px-6 space-y-4 md:max-w-lg">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </>
  )
}
