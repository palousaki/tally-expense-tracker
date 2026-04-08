import { GridSkeleton } from '@/components/ui/Skeleton'

export default function BudgetsLoading() {
  return (
    <>
      <div className="px-4 pt-5 pb-4 md:px-6 md:pt-6">
        <div className="h-6 w-24 rounded-lg bg-gray-100 animate-pulse" />
      </div>
      <GridSkeleton cards={8} />
    </>
  )
}
