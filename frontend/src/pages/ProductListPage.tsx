import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product'
import { ProductCardSkeleton } from '@/components/ui'

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined

  const { data, isLoading, error } = useProducts({ category })

  const products = data?.data || []

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-tcnr01-2xl font-medium">
            {category || '全部商品'}
          </h1>
          {data && (
            <p className="text-tcnr01-sm text-tcnr01-gray-400 mt-1">
              {data.total} 件商品
            </p>
          )}
        </div>

        {/* Filters (簡化版) */}
        <div className="flex items-center gap-4">
          <select className="tcnr01-input w-auto">
            <option value="">排序方式</option>
            <option value="newest">最新上架</option>
            <option value="price-asc">價格由低到高</option>
            <option value="price-desc">價格由高到低</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-tcnr01-gray-400">載入商品時發生錯誤</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-tcnr01-lg font-medium mb-2">沒有找到商品</p>
          <p className="text-tcnr01-gray-400">
            請嘗試其他分類或搜尋條件
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
