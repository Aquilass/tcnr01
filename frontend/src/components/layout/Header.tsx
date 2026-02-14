import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { cart, openDrawer } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchValue.trim()
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
      setSearchValue('')
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-tcnr01-gray-100">
      {/* Top Banner */}
      <div className="bg-tcnr01-gray-50 py-2">
        <div className="container mx-auto px-6">
          <p className="text-center text-tcnr01-xs text-tcnr01-gray-500">
            新會員首購享 9 折優惠 | 免運費門檻 NT$3,000
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-2 -ml-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="開啟選單"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <svg
              className="h-6 w-16"
              viewBox="0 0 69.67 30.19"
              fill="currentColor"
            >
              <path d="M68.56 1.59C54.32 7.1 14.33 22.64 3.19 26.97c-3.7 1.44-6.53-.5-2.68-3.51 0 0 40.52-16.97 48.46-19.82 3.07-1.1 4.35-.16 3.07 2.6-1.43 3.09-7.46 15.33-7.46 15.33-.71 1.43.38 1.87 1.43.89 2.15-2.01 22.53-20.87 22.53-20.87z" />
            </svg>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
            >
              全部商品
            </Link>
            <Link
              to="/products?category=男鞋"
              className="text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
            >
              男款
            </Link>
            <Link
              to="/products?category=女鞋"
              className="text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
            >
              女款
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜尋商品..."
                  autoFocus
                  className="w-32 md:w-48 px-3 py-1.5 border border-tcnr01-gray-200 rounded-full text-tcnr01-sm focus:outline-none focus:ring-1 focus:ring-tcnr01-black"
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchValue('') }}
                  className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors"
                  aria-label="關閉搜尋"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(true)}
                aria-label="搜尋"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors hidden md:flex"
                aria-label="收藏清單"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Link>
            )}

            {/* User */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors hidden md:flex"
                aria-label="帳戶"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-tcnr01-sm font-medium hover:text-tcnr01-gray-400 transition-colors hidden md:block"
              >
                登入
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors relative"
              aria-label="購物車"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-tcnr01-black text-white text-tcnr01-xs rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
