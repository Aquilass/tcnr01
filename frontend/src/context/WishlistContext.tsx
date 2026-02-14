import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '@/services/wishlistService'
import { useAuth } from './AuthContext'
import type { Wishlist } from '@/types'

interface WishlistContextType {
  wishlist: Wishlist | null
  isLoading: boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data: wishlist = null, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  })

  const addMutation = useMutation({
    mutationFn: wishlistService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const addItem = async (productId: string) => {
    await addMutation.mutateAsync(productId)
  }

  const removeItem = async (productId: string) => {
    await removeMutation.mutateAsync(productId)
  }

  const isWishlisted = (productId: string) => {
    if (!wishlist) return false
    return wishlist.items.some((item) => item.productId === productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, addItem, removeItem, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
