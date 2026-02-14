import { Link } from 'react-router-dom'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/utils/format'
import { Button } from '@/components/ui'

export default function WishlistPage() {
  const { wishlist, isLoading, removeItem } = useWishlist()

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-tcnr01-2xl font-medium mb-8">我的收藏</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-tcnr01-gray-200 border-t-tcnr01-black rounded-full" />
        </div>
      </div>
    )
  }

  const isEmpty = !wishlist || wishlist.items.length === 0

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-tcnr01-2xl font-medium mb-8">我的收藏</h1>

      {isEmpty ? (
        <div className="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto text-tcnr01-gray-300 mb-4"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="text-tcnr01-lg font-medium mb-2">收藏清單是空的</p>
          <p className="text-tcnr01-sm text-tcnr01-gray-400 mb-6">
            瀏覽商品並將喜歡的單品加入收藏
          </p>
          <Link to="/products">
            <Button>開始購物</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.items.map((item) => (
            <div key={item.id} className="group">
              <Link to={`/products/${item.productSlug}`} className="block">
                <div className="relative aspect-square bg-tcnr01-gray-50 rounded-tcnr01-lg overflow-hidden mb-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-tcnr01-base font-medium truncate">{item.productName}</h3>
                <p className="text-tcnr01-sm text-tcnr01-gray-500 mt-1">{formatPrice(item.price)}</p>
              </Link>
              <button
                onClick={() => removeItem(item.productId)}
                className="mt-2 text-tcnr01-sm text-tcnr01-gray-400 hover:text-red-600 underline underline-offset-4 transition-colors"
              >
                移除收藏
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
