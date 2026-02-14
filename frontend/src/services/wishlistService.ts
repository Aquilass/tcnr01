import { api } from './api'
import type { Wishlist, WishlistItem } from '@/types'

export const wishlistService = {
  getWishlist: () =>
    api.get<Wishlist>('/wishlist'),

  addItem: (productId: string) =>
    api.post<WishlistItem>('/wishlist', { productId }),

  removeItem: (productId: string) =>
    api.delete<{ message: string }>(`/wishlist/${productId}`),
}
