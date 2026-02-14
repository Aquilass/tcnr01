import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('請填寫所有欄位')
      return
    }

    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-tcnr01-2xl font-medium text-center mb-2">登入帳戶</h1>
        <p className="text-tcnr01-base text-tcnr01-gray-400 text-center mb-8">
          登入以查看訂單和管理帳戶
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-tcnr01 text-red-600 text-tcnr01-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-tcnr01-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-tcnr01-sm font-medium mb-2">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent"
              placeholder="輸入密碼"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '登入中...' : '登入'}
          </Button>
        </form>

        <p className="mt-8 text-center text-tcnr01-sm text-tcnr01-gray-400">
          還沒有帳戶？{' '}
          <Link to="/register" className="text-tcnr01-black underline underline-offset-4 font-medium">
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  )
}
