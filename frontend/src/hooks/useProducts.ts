import { useQuery } from '@tanstack/react-query'
import { productService, type GetProductsParams } from '@/services/productService'

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  })
}
