import type { ProductColor } from '@/types'
import { cn } from '@/utils/format'

interface ColorSelectorProps {
  colors: ProductColor[]
  selectedColorId: string | null
  onSelect: (colorId: string) => void
}

export function ColorSelector({ colors, selectedColorId, onSelect }: ColorSelectorProps) {
  if (colors.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-tcnr01-base">選擇顏色</span>
        {selectedColorId && (
          <span className="text-tcnr01-base text-tcnr01-gray-400">
            {colors.find(c => c.id === selectedColorId)?.name}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelect(color.id)}
            className={cn(
              'tcnr01-color-btn',
              selectedColorId === color.id && 'tcnr01-color-btn-selected'
            )}
            aria-label={color.name}
            title={color.name}
          >
            <img
              src={color.imageUrl}
              alt={color.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
