import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/services/cartService'
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types'

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (request: AddToCartRequest) => Promise<void>
  updateItem: (itemId: string, request: UpdateCartItemRequest) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  })

  const addItemMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
      setIsDrawerOpen(true)
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, request }: { itemId: string; request: UpdateCartItemRequest }) =>
      cartService.updateItem(itemId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
    },
  })

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
    },
  })

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const addItem = useCallback(
    async (request: AddToCartRequest) => {
      await addItemMutation.mutateAsync(request)
    },
    [addItemMutation]
  )

  const updateItem = useCallback(
    async (itemId: string, request: UpdateCartItemRequest) => {
      await updateItemMutation.mutateAsync({ itemId, request })
    },
    [updateItemMutation]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      await removeItemMutation.mutateAsync(itemId)
    },
    [removeItemMutation]
  )

  const clearCart = useCallback(async () => {
    await clearCartMutation.mutateAsync()
  }, [clearCartMutation])

  return (
    <CartContext.Provider
      value={{
        cart: cart ?? null,
        isLoading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
