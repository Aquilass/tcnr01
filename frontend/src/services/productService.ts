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
  getProducts: (params?: GetProductsParams) => {
    const apiParams: Record<string, string | number | boolean | undefined> | undefined = params
      ? {
          category: params.category,
          search: params.search,
          sort: params.sort,
          page: params.page,
          page_size: params.pageSize,
        }
      : undefined

    return api.get<PaginatedResponse<ProductListItem>>('/products', { params: apiParams })
  },

  getProductBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`),
}
