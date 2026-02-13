import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10 || isUpdating) return
    setIsUpdating(true)
    try {
      await updateItem(item.id, { quantity: newQuantity })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeItem(item.id)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex gap-4 py-6 border-b border-tcnr01-gray-100">
      {/* Image */}
      <Link to={`/products/${item.productId}`} className="flex-shrink-0">
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-[150px] h-[150px] object-cover bg-tcnr01-gray-50 rounded-tcnr01"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <Link
              to={`/products/${item.productId}`}
              className="text-tcnr01-base font-medium hover:underline"
            >
              {item.productName}
            </Link>
            <p className="text-tcnr01-sm text-tcnr01-gray-400 mt-1">
              {item.colorName}
            </p>
            <p className="text-tcnr01-sm text-tcnr01-gray-400">
              尺寸 {item.size}
            </p>
          </div>
          <p className="text-tcnr01-base font-medium">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-tcnr01-gray-200 rounded-tcnr01">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="w-10 h-10 flex items-center justify-center hover:bg-tcnr01-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="減少數量"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="w-10 text-center text-tcnr01-base">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= 10 || isUpdating}
                className="w-10 h-10 flex items-center justify-center hover:bg-tcnr01-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="增加數量"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors disabled:opacity-50"
            aria-label="移除商品"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
