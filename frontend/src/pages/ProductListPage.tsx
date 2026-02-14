import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product'
import { ProductCardSkeleton } from '@/components/ui'
import { Pagination } from '@/components/ui/Pagination'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const searchQuery = searchParams.get('search') || undefined
  const sortParam = searchParams.get('sort') || undefined
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [sort, setSort] = useState(sortParam || '')

  const { data, isLoading, error } = useProducts({
    category,
    search: searchQuery,
    sort: sort || undefined,
    page: pageParam,
  })

  const products = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleSortChange = (value: string) => {
    setSort(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    params.delete('page')
    setSearchParams(params)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', String(page))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-tcnr01-2xl font-medium">
            {searchQuery ? `搜尋「${searchQuery}」` : category || '全部商品'}
          </h1>
          {data && (
            <p className="text-tcnr01-sm text-tcnr01-gray-400 mt-1">
              {data.total} 件商品
            </p>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <select
            className="tcnr01-input w-auto"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={pageParam}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
