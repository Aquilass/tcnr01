import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Drawer } from '@/components/ui'
import { CartItem } from './CartItem'
import { formatPrice } from '@/utils/format'

export function CartDrawer() {
  const { cart, isLoading, isDrawerOpen, closeDrawer } = useCart()
  const navigate = useNavigate()

  const isEmpty = !cart || cart.items.length === 0

  return (
    <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} title="購物袋">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-tcnr01-gray-200 border-t-tcnr01-black rounded-full" />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-tcnr01-gray-300 mb-4"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className="text-tcnr01-lg font-medium mb-2">購物袋是空的</p>
          <p className="text-tcnr01-sm text-tcnr01-gray-400 mb-6">
            瀏覽我們的商品，找到你喜歡的單品
          </p>
          <Link
            to="/products"
            onClick={closeDrawer}
            className="tcnr01-btn-primary"
          >
            開始購物
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Items */}
          <div className="flex-1 overflow-auto px-6">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-tcnr01-gray-100 px-6 py-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-tcnr01-base">小計</span>
              <span className="text-tcnr01-base font-medium">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <p className="text-tcnr01-sm text-tcnr01-gray-400 mb-6">
              運費和稅金將於結帳時計算
            </p>
            <div className="space-y-3">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="tcnr01-btn-secondary w-full"
              >
                檢視購物袋
              </Link>
              <button
                className="tcnr01-btn-primary w-full"
                onClick={() => { closeDrawer(); navigate('/checkout') }}
              >
                結帳
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
