import { api } from './api'
import type { Order, OrderListItem, CreateOrderRequest } from '@/types'

export const orderService = {
  createOrder: (data: CreateOrderRequest) =>
    api.post<Order>('/orders', data),

  getOrders: () =>
    api.get<OrderListItem[]>('/orders'),

  getOrder: (id: string) =>
    api.get<Order>(`/orders/${id}`),
}
