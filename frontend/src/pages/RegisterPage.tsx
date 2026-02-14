import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName || !lastName || !email || !password) {
      setError('請填寫所有欄位')
      return
    }

    if (password.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-tcnr01-2xl font-medium text-center mb-2">建立帳戶</h1>
        <p className="text-tcnr01-base text-tcnr01-gray-400 text-center mb-8">
          加入會員享受專屬優惠
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-tcnr01 text-red-600 text-tcnr01-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-tcnr01-sm font-medium mb-2">
                姓氏
              </label>
              <input
                id="firstName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent"
                placeholder="王"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-tcnr01-sm font-medium mb-2">
                名字
              </label>
              <input
                id="lastName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent"
                placeholder="小明"
              />
            </div>
          </div>

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
              placeholder="至少 6 個字元"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '註冊中...' : '建立帳戶'}
          </Button>
        </form>

        <p className="mt-8 text-center text-tcnr01-sm text-tcnr01-gray-400">
          已有帳戶？{' '}
          <Link to="/login" className="text-tcnr01-black underline underline-offset-4 font-medium">
            登入
          </Link>
        </p>
      </div>
    </div>
  )
}
