import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchValue.trim()
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
      setSearchValue('')
      onClose()
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tcnr01-gray-100">
          <svg className="h-5 w-14" viewBox="0 0 69.67 30.19" fill="currentColor">
            <path d="M68.56 1.59C54.32 7.1 14.33 22.64 3.19 26.97c-3.7 1.44-6.53-.5-2.68-3.51 0 0 40.52-16.97 48.46-19.82 3.07-1.1 4.35-.16 3.07 2.6-1.43 3.09-7.46 15.33-7.46 15.33-.71 1.43.38 1.87 1.43.89 2.15-2.01 22.53-20.87 22.53-20.87z" />
          </svg>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tcnr01-gray-50 rounded-full transition-colors"
            aria-label="關閉選單"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-tcnr01-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜尋商品..."
              className="w-full pl-10 pr-4 py-2.5 border border-tcnr01-gray-200 rounded-full text-tcnr01-sm focus:outline-none focus:ring-1 focus:ring-tcnr01-black"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tcnr01-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block py-3 text-tcnr01-lg font-medium hover:text-tcnr01-gray-400 transition-colors"
              >
                首頁
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                onClick={handleLinkClick}
                className="block py-3 text-tcnr01-lg font-medium hover:text-tcnr01-gray-400 transition-colors"
              >
                全部商品
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=男鞋"
                onClick={handleLinkClick}
                className="block py-3 text-tcnr01-lg font-medium hover:text-tcnr01-gray-400 transition-colors"
              >
                男款
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=女鞋"
                onClick={handleLinkClick}
                className="block py-3 text-tcnr01-lg font-medium hover:text-tcnr01-gray-400 transition-colors"
              >
                女款
              </Link>
            </li>
          </ul>
        </nav>

        {/* Divider */}
        <div className="border-t border-tcnr01-gray-100" />

        {/* User Section */}
        <div className="px-6 py-4">
          {isAuthenticated ? (
            <ul className="space-y-1">
              <li>
                <p className="py-2 text-tcnr01-sm text-tcnr01-gray-400">
                  {user?.first_name} {user?.last_name}
                </p>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="block py-3 text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
                >
                  我的帳戶
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  onClick={handleLinkClick}
                  className="block py-3 text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
                >
                  我的訂單
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={handleLinkClick}
                  className="block py-3 text-tcnr01-base font-medium hover:text-tcnr01-gray-400 transition-colors"
                >
                  我的收藏
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 text-tcnr01-base font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  登出
                </button>
              </li>
            </ul>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block w-full text-center py-3 bg-tcnr01-black text-white rounded-full font-medium hover:bg-tcnr01-gray-800 transition-colors"
              >
                登入
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="block w-full text-center py-3 border border-tcnr01-gray-300 rounded-full font-medium hover:border-tcnr01-black transition-colors"
              >
                加入會員
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
