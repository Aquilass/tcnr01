import type { ProductSize } from '@/types'
import { cn } from '@/utils/format'

interface SizeSelectorProps {
  sizes: ProductSize[]
  selectedSizeId: string | null
  onSelect: (sizeId: string) => void
}

export function SizeSelector({ sizes, selectedSizeId, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-tcnr01-base">選擇尺寸</span>
        <button className="text-tcnr01-sm text-tcnr01-gray-400 underline underline-offset-4 hover:text-tcnr01-black transition-colors">
          尺寸指南
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {sizes.map((size) => {
          const isOutOfStock = size.stock === 0
          const isSelected = selectedSizeId === size.id

          return (
            <button
              key={size.id}
              onClick={() => !isOutOfStock && onSelect(size.id)}
              disabled={isOutOfStock}
              className={cn(
                isOutOfStock
                  ? 'tcnr01-size-btn-disabled'
                  : isSelected
                  ? 'tcnr01-size-btn-selected'
                  : 'tcnr01-size-btn'
              )}
            >
              {size.size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
