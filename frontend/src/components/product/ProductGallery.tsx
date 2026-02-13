import { useState } from 'react'
import type { ProductImage } from '@/types'
import { cn } from '@/utils/format'

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex]

  if (images.length === 0) {
    return (
      <div className="aspect-tcnr01-product bg-tcnr01-gray-50 rounded-tcnr01 flex items-center justify-center">
        <span className="text-tcnr01-gray-300">無圖片</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-tcnr01-product bg-tcnr01-gray-50 rounded-tcnr01 overflow-hidden relative">
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'w-[60px] h-[60px] flex-shrink-0 rounded-tcnr01 overflow-hidden transition-all duration-200',
                index === selectedIndex
                  ? 'ring-2 ring-tcnr01-black ring-offset-2'
                  : 'hover:ring-2 hover:ring-tcnr01-gray-200 hover:ring-offset-2'
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
