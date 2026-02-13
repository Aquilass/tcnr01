import { api } from './api'
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types'

export const cartService = {
  getCart: () => api.get<Cart>('/cart'),

  addItem: (request: AddToCartRequest) =>
    api.post<Cart>('/cart/items', request),

  updateItem: (itemId: string, request: UpdateCartItemRequest) =>
    api.put<Cart>(`/cart/items/${itemId}`, request),

  removeItem: (itemId: string) =>
    api.delete<Cart>(`/cart/items/${itemId}`),

  clearCart: () => api.delete<Cart>('/cart'),
}
