import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { CartItem } from '@/components/cart'
import { Button } from '@/components/ui'
import { formatPrice } from '@/utils/format'

export default function CartPage() {
  const { cart, isLoading, clearCart } = useCart()

  const isEmpty = !cart || cart.items.length === 0

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-tcnr01-gray-200 border-t-tcnr01-black rounded-full" />
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-tcnr01-2xl font-medium mb-8">購物袋</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-tcnr01-gray-300 mb-6"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2 className="text-tcnr01-xl font-medium mb-3">購物袋是空的</h2>
          <p className="text-tcnr01-base text-tcnr01-gray-400 mb-8 max-w-md">
            看起來你還沒有添加任何商品到購物袋。瀏覽我們的商品，找到你喜歡的單品吧！
          </p>
          <Link to="/products">
            <Button size="lg">開始購物</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-tcnr01-2xl font-medium mb-8">購物袋</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Clear Cart */}
            <div className="pt-4">
              <button
                onClick={() => clearCart()}
                className="text-tcnr01-sm text-tcnr01-gray-400 underline underline-offset-4 hover:text-tcnr01-black transition-colors"
              >
                清空購物袋
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 lg:sticky lg:top-24">
            <h2 className="text-tcnr01-lg font-medium mb-6">訂單摘要</h2>

            <div className="space-y-4 pb-6 border-b border-tcnr01-gray-100">
              <div className="flex justify-between">
                <span className="text-tcnr01-base text-tcnr01-gray-400">商品小計</span>
                <span className="text-tcnr01-base">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tcnr01-base text-tcnr01-gray-400">運費</span>
                <span className="text-tcnr01-base">
                  {cart.subtotal >= 3000 ? '免費' : formatPrice(120)}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-6 border-b border-tcnr01-gray-100">
              <span className="text-tcnr01-lg font-medium">總計</span>
              <span className="text-tcnr01-lg font-medium">
                {formatPrice(cart.subtotal + (cart.subtotal >= 3000 ? 0 : 120))}
              </span>
            </div>

            <div className="pt-6 space-y-4">
              <Button size="lg" className="w-full">
                前往結帳
              </Button>
              <p className="text-tcnr01-xs text-tcnr01-gray-400 text-center">
                點擊「前往結帳」即表示您同意我們的
                <a href="#" className="underline">條款與細則</a>
              </p>
            </div>

            {/* Promo */}
            {cart.subtotal < 3000 && (
              <div className="mt-6 p-4 bg-tcnr01-gray-50 rounded-tcnr01">
                <p className="text-tcnr01-sm text-tcnr01-gray-500">
                  再消費 <strong className="text-tcnr01-black">{formatPrice(3000 - cart.subtotal)}</strong> 即可享免運費
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
