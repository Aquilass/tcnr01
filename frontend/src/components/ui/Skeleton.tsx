import { cn } from '@/utils/format'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-tcnr01-gray-100 rounded-tcnr01',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-tcnr01-product w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-[60px] h-[60px]" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-[60px] h-[60px] rounded-tcnr01" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </div>
        <Skeleton className="h-14 w-full rounded-tcnr01-full" />
      </div>
    </div>
  )
}
