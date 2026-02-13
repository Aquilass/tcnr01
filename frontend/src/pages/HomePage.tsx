import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product'
import { ProductCardSkeleton, Button } from '@/components/ui'

export default function HomePage() {
  const { data, isLoading } = useProducts({ pageSize: 4 })
  const products = data?.data || []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-tcnr01-gray-50">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-tcnr01-sm font-medium mb-2">TCNR01 最新系列</p>
            <h1 className="text-tcnr01-4xl lg:text-[64px] font-bold leading-tight mb-4">
              JUST DO IT
            </h1>
            <p className="text-tcnr01-lg text-tcnr01-gray-500 mb-8">
              突破極限，超越自我。探索 TCNR01 最新運動鞋款，為你的每一步注入動力。
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg">立即選購</Button>
              </Link>
              <Link to="/products?category=男鞋">
                <Button variant="secondary" size="lg">探索男款</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
            alt="TCNR01 運動鞋"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tcnr01-gray-50 to-transparent" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-tcnr01-xl font-medium">精選商品</h2>
          <Link
            to="/products"
            className="text-tcnr01-base font-medium underline underline-offset-4 hover:text-tcnr01-gray-400 transition-colors"
          >
            查看全部
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-tcnr01-xl font-medium mb-8">依分類選購</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men */}
          <Link
            to="/products?category=男鞋"
            className="group relative aspect-[4/5] overflow-hidden rounded-tcnr01-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
              alt="男款"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-tcnr01-xl font-bold mb-2">男款</h3>
              <span className="inline-flex items-center text-white text-tcnr01-sm font-medium">
                立即選購
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ml-1 transition-transform group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Women */}
          <Link
            to="/products?category=女鞋"
            className="group relative aspect-[4/5] overflow-hidden rounded-tcnr01-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80"
              alt="女款"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-tcnr01-xl font-bold mb-2">女款</h3>
              <span className="inline-flex items-center text-white text-tcnr01-sm font-medium">
                立即選購
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ml-1 transition-transform group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>

          {/* All */}
          <Link
            to="/products"
            className="group relative aspect-[4/5] overflow-hidden rounded-tcnr01-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
              alt="全部商品"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-tcnr01-xl font-bold mb-2">全部商品</h3>
              <span className="inline-flex items-center text-white text-tcnr01-sm font-medium">
                立即選購
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ml-1 transition-transform group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* TCNR01 Membership */}
      <section className="bg-tcnr01-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-tcnr01-2xl font-bold mb-4">成為 TCNR01 會員</h2>
          <p className="text-tcnr01-base text-tcnr01-gray-300 mb-8 max-w-xl mx-auto">
            加入 TCNR01 會員，搶先獲取最新產品資訊、獨家優惠和會員專屬活動邀請。
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg" className="bg-white text-tcnr01-black hover:bg-tcnr01-gray-100">
              加入會員
            </Button>
            <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white/10">
              登入
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
