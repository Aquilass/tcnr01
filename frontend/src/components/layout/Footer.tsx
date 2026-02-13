import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-tcnr01-black text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="text-tcnr01-sm font-bold mb-4 uppercase tracking-wider">
              尋找門市
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  尋找 TCNR01 門市
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  成為 TCNR01 會員
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  學生優惠
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-tcnr01-sm font-bold mb-4 uppercase tracking-wider">
              取得協助
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  訂單狀態
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  運送與配送
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  退貨
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  付款方式
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-tcnr01-sm font-bold mb-4 uppercase tracking-wider">
              關於 TCNR01
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  新聞
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  人才招募
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  投資者
                </Link>
              </li>
              <li>
                <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-sm transition-colors">
                  永續發展
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h4 className="text-tcnr01-sm font-bold mb-4 uppercase tracking-wider">
              關注我們
            </h4>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-tcnr01-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-tcnr01-gray-300 text-tcnr01-xs">
              <span>© 2024 TCNR01 Clone Project</span>
              <span>•</span>
              <span>Taiwan</span>
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-xs transition-colors">
                隱私權政策
              </Link>
              <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-xs transition-colors">
                使用條款
              </Link>
              <Link to="#" className="text-tcnr01-gray-300 hover:text-white text-tcnr01-xs transition-colors">
                Cookie 設定
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
