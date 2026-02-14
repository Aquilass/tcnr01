import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="text-[120px] font-bold text-tcnr01-gray-100 leading-none">404</h1>
      <h2 className="text-tcnr01-2xl font-medium mt-4 mb-4">找不到頁面</h2>
      <p className="text-tcnr01-base text-tcnr01-gray-400 mb-8 max-w-md mx-auto">
        你要找的頁面不存在或已被移除。請確認網址是否正確，或回到首頁繼續瀏覽。
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/">
          <Button size="lg">回到首頁</Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary" size="lg">瀏覽商品</Button>
        </Link>
      </div>
    </div>
  )
}
