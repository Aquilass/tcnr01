// 產品相關類型
export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
}

export interface ProductColor {
  id: string
  name: string
  code: string
  imageUrl: string
}

export interface ProductSize {
  id: string
  size: string
  stock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: ProductImage[]
  colors: ProductColor[]
  sizes: ProductSize[]
  createdAt: string
  updatedAt: string
}

export interface ProductListItem {
  id: string
  slug: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  category: string
  imageUrl: string
  colorCount: number
}

// 購物車相關類型
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  colorId: string
  colorName: string
  sizeId: string
  size: string
  price: number
  quantity: number
}

export interface Cart {
  id: string
  sessionId: string
  items: CartItem[]
  itemCount: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

// API 回應類型
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 請求類型
export interface AddToCartRequest {
  productId: string
  colorId: string
  sizeId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}
