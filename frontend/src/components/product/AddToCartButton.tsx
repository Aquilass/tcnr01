import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui'

interface AddToCartButtonProps {
  productId: string
  colorId: string | null
  sizeId: string | null
  disabled?: boolean
}

export function AddToCartButton({ productId, colorId, sizeId, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDisabled = disabled || !colorId || !sizeId

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
        disabled={isDisabled}
      >
        加入最愛 ♡
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
