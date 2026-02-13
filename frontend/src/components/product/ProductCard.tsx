import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/format'
import type { ProductListItem } from '@/types'

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block"
    >
      {/* Image */}
      <div className="tcnr01-product-image mb-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-tcnr01-orange text-white text-tcnr01-xs px-2 py-1 rounded">
            特價
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        {/* Status/Category */}
        <p className="text-tcnr01-sm text-tcnr01-orange font-medium">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-tcnr01-base font-medium tcnr01-truncate-2">
          {product.name}
        </h3>

        {/* Subtitle */}
        <p className="text-tcnr01-sm text-tcnr01-gray-400">
          {product.subtitle}
        </p>

        {/* Color Count */}
        {product.colorCount > 1 && (
          <p className="text-tcnr01-sm text-tcnr01-gray-400">
            {product.colorCount} 種顏色
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-tcnr01-base font-medium">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-tcnr01-sm text-tcnr01-gray-300 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
