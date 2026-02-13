import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <div className="space-y-2">
      <p className="text-tcnr01-sm text-tcnr01-orange font-medium">
        {product.category}
      </p>
      <h1 className="text-tcnr01-2xl font-medium">{product.name}</h1>
      <p className="text-tcnr01-base text-tcnr01-gray-400">{product.subtitle}</p>

      <div className="flex items-center gap-3 pt-2">
        <span className="text-tcnr01-lg font-medium">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-tcnr01-base text-tcnr01-gray-300 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
            <span className="text-tcnr01-sm text-tcnr01-green font-medium">
              {Math.round((1 - product.price / product.originalPrice!) * 100)}% off
            </span>
          </>
        )}
      </div>
    </div>
  )
}
