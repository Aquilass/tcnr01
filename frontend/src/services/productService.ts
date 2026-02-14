import { api } from './api'
import type { Product, ProductListItem, PaginatedResponse } from '@/types'

export interface GetProductsParams {
  category?: string
  search?: string
  sort?: string
  page?: number
  pageSize?: number
}

export const productService = {
  getProducts: (params?: GetProductsParams) =>
    api.get<PaginatedResponse<ProductListItem>>('/products', {
      params: params as Record<string, string | number | boolean | undefined> | undefined
    }),

  getProductBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`),
}
