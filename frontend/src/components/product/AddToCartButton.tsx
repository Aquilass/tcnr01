import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'

interface AddToCartButtonProps {
  productId: string
  colorId: string | null
  sizeId: string | null
  disabled?: boolean
}

export function AddToCartButton({ productId, colorId, sizeId, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlist()
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDisabled = disabled || !colorId || !sizeId
  const wishlisted = isWishlisted(productId)

  const handleAddToCart = async () => {
    if (isDisabled || !colorId || !sizeId) {
      if (!sizeId) {
        setError('請選擇尺寸')
      } else if (!colorId) {
        setError('請選擇顏色')
      }
      return
    }

    setError(null)
    setIsAdding(true)

    try {
      await addItem({
        productId,
        colorId,
        sizeId,
        quantity: 1,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入購物車失敗')
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsTogglingWishlist(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗')
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        loading={isAdding}
        size="lg"
        className="w-full"
      >
        {isAdding ? '加入中...' : '加入購物袋'}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
      >
        {isTogglingWishlist
          ? '處理中...'
          : wishlisted
            ? '已收藏 ♥'
            : '加入最愛 ♡'}
      </Button>

      {error && (
        <p className="text-tcnr01-red text-tcnr01-sm text-center animate-tcnr01-fade-in">
          {error}
        </p>
      )}

      {!sizeId && !error && (
        <p className="text-tcnr01-sm text-tcnr01-gray-400 text-center">
          請先選擇尺寸
        </p>
      )}
    </div>
  )
}
