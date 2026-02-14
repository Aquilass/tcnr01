import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { orderService } from '@/services/orderService'
import { Button } from '@/components/ui'
import { formatPrice } from '@/utils/format'
import { useQueryClient } from '@tanstack/react-query'

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [recipientName, setRecipientName] = useState(
    user ? `${user.last_name}${user.first_name}` : ''
  )
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '')
  const [shippingAddress, setShippingAddress] = useState(
    user ? [user.address_line1, user.address_line2].filter(Boolean).join(' ') : ''
  )
  const [shippingCity, setShippingCity] = useState(user?.city || '')
  const [shippingState, setShippingState] = useState(user?.state || '')
  const [shippingPostalCode, setShippingPostalCode] = useState(user?.postal_code || '')
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isEmpty = !cart || cart.items.length === 0

  if (cartLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-tcnr01-gray-200 border-t-tcnr01-black rounded-full" />
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-tcnr01-2xl font-medium mb-8">結帳</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-tcnr01-xl font-medium mb-3">購物袋是空的</h2>
          <p className="text-tcnr01-base text-tcnr01-gray-400 mb-8">
            請先將商品加入購物袋再進行結帳。
          </p>
          <Link to="/products">
            <Button size="lg">開始購物</Button>
          </Link>
        </div>
      </div>
    )
  }

  const shippingFee = cart.subtotal >= 3000 ? 0 : 120
  const total = cart.subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!recipientName.trim() || !recipientPhone.trim() || !shippingAddress.trim()) {
      setError('請填寫所有必填欄位')
      return
    }

    setIsSubmitting(true)
    try {
      const order = await orderService.createOrder({
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity || undefined,
        shipping_state: shippingState || undefined,
        shipping_postal_code: shippingPostalCode || undefined,
        payment_method: paymentMethod,
        notes: notes || undefined,
      })
      queryClient.setQueryData(['cart'], null)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '下單失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent'

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-tcnr01-2xl font-medium mb-8">結帳</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
              <h2 className="text-tcnr01-lg font-medium mb-6">收件資訊</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-tcnr01 text-red-600 text-tcnr01-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">
                    收件人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className={inputClass}
                    placeholder="請輸入收件人姓名"
                  />
                </div>

                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">
                    聯絡電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className={inputClass}
                    placeholder="09xx-xxx-xxx"
                  />
                </div>

                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">
                    收件地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className={inputClass}
                    placeholder="請輸入完整地址"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-tcnr01-sm font-medium mb-1">縣市</label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-tcnr01-sm font-medium mb-1">區域</label>
                    <input
                      type="text"
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-tcnr01-sm font-medium mb-1">郵遞區號</label>
                    <input
                      type="text"
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">備註</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="如有特殊需求請在此備註"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
              <h2 className="text-tcnr01-lg font-medium mb-6">付款方式</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-tcnr01-gray-200 rounded-tcnr01 cursor-pointer hover:border-tcnr01-black transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-tcnr01-black"
                  />
                  <div>
                    <p className="text-tcnr01-base font-medium">信用卡</p>
                    <p className="text-tcnr01-sm text-tcnr01-gray-400">Visa / Mastercard / JCB</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-tcnr01-gray-200 rounded-tcnr01 cursor-pointer hover:border-tcnr01-black transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="atm"
                    checked={paymentMethod === 'atm'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-tcnr01-black"
                  />
                  <div>
                    <p className="text-tcnr01-base font-medium">ATM 轉帳</p>
                    <p className="text-tcnr01-sm text-tcnr01-gray-400">銀行 ATM 或網路轉帳</p>
                  </div>
                </label>
              </div>
              {paymentMethod === 'credit_card' && (
                <div className="mt-4 p-4 bg-tcnr01-gray-50 rounded-tcnr01">
                  <p className="text-tcnr01-sm text-tcnr01-gray-500">
                    此為模擬付款，無需輸入真實卡號。確認下單後將自動完成付款。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-tcnr01-lg font-medium mb-6">訂單摘要</h2>

              {/* Items */}
              <div className="space-y-4 pb-6 border-b border-tcnr01-gray-100">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-tcnr01"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-tcnr01-sm font-medium truncate">{item.productName}</p>
                      <p className="text-tcnr01-xs text-tcnr01-gray-400">
                        {item.colorName} / {item.size}
                      </p>
                      <p className="text-tcnr01-xs text-tcnr01-gray-400">數量：{item.quantity}</p>
                    </div>
                    <p className="text-tcnr01-sm font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 py-6 border-b border-tcnr01-gray-100">
                <div className="flex justify-between">
                  <span className="text-tcnr01-base text-tcnr01-gray-400">商品小計</span>
                  <span className="text-tcnr01-base">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tcnr01-base text-tcnr01-gray-400">運費</span>
                  <span className="text-tcnr01-base">
                    {shippingFee === 0 ? '免費' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-6">
                <span className="text-tcnr01-lg font-medium">總計</span>
                <span className="text-tcnr01-lg font-medium">{formatPrice(total)}</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? '處理中...' : '確認下單'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
