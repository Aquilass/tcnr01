import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { ProductDetailSkeleton } from '@/components/ui'
import {
  ProductGallery,
  ColorSelector,
  SizeSelector,
  AddToCartButton,
  ProductInfo,
  ProductDescription,
} from '@/components/product'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug || '')

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)

  // Set default color when product loads
  useEffect(() => {
    if (product && product.colors.length > 0 && !selectedColorId) {
      setSelectedColorId(product.colors[0].id)
    }
  }, [product, selectedColorId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <h1 className="text-tcnr01-2xl font-medium mb-4">找不到商品</h1>
          <p className="text-tcnr01-gray-400">
            抱歉，您尋找的商品不存在或已下架
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <ProductInfo product={product} />

          <ColorSelector
            colors={product.colors}
            selectedColorId={selectedColorId}
            onSelect={setSelectedColorId}
          />

          <SizeSelector
            sizes={product.sizes}
            selectedSizeId={selectedSizeId}
            onSelect={setSelectedSizeId}
          />

          <AddToCartButton
            productId={product.id}
            colorId={selectedColorId}
            sizeId={selectedSizeId}
          />

          <ProductDescription description={product.description} />

          {/* Shipping Info */}
          <div className="border-t border-tcnr01-gray-100 pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="flex-shrink-0 mt-0.5"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div>
                <p className="text-tcnr01-base font-medium">免運費配送</p>
                <p className="text-tcnr01-sm text-tcnr01-gray-400">
                  訂單滿 NT$3,000 即享免運費
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="flex-shrink-0 mt-0.5"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <div>
                <p className="text-tcnr01-base font-medium">30 天免費退換貨</p>
                <p className="text-tcnr01-sm text-tcnr01-gray-400">
                  不滿意可在 30 天內免費退換
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
