import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { Button } from '@/components/ui'
import { formatPrice } from '@/utils/format'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '處理中', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: '已確認', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: '已出貨', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: '已送達', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' },
}

const PAYMENT_MAP: Record<string, string> = {
  credit_card: '信用卡',
  atm: 'ATM 轉帳',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-tcnr01-gray-200 border-t-tcnr01-black rounded-full" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <h2 className="text-tcnr01-xl font-medium mb-3">找不到訂單</h2>
          <Link to="/products">
            <Button>繼續購物</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = STATUS_MAP[order.status] || {
    label: order.status,
    color: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="text-tcnr01-sm text-tcnr01-gray-400 hover:text-tcnr01-black transition-colors"
          >
            ← 返回訂單列表
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-tcnr01-2xl font-medium">{order.orderNumber}</h1>
            <p className="text-tcnr01-sm text-tcnr01-gray-400 mt-1">
              下單時間：{new Date(order.createdAt).toLocaleString('zh-TW')}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-tcnr01-sm font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <h2 className="text-tcnr01-lg font-medium mb-6">商品明細</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-tcnr01-gray-50 last:border-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-tcnr01"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-tcnr01-base font-medium">{item.productName}</p>
                  <p className="text-tcnr01-sm text-tcnr01-gray-400 mt-1">
                    顏色：{item.colorName}
                  </p>
                  <p className="text-tcnr01-sm text-tcnr01-gray-400">尺寸：{item.size}</p>
                  <p className="text-tcnr01-sm text-tcnr01-gray-400">數量：{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-tcnr01-base font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-tcnr01-xs text-tcnr01-gray-400">
                      {formatPrice(item.price)} / 件
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <h2 className="text-tcnr01-lg font-medium mb-4">金額明細</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-tcnr01-base text-tcnr01-gray-400">商品小計</span>
              <span className="text-tcnr01-base">{formatPrice(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tcnr01-base text-tcnr01-gray-400">運費</span>
              <span className="text-tcnr01-base">
                {order.shippingFee === 0 ? '免費' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-tcnr01-gray-100">
              <span className="text-tcnr01-lg font-medium">總計</span>
              <span className="text-tcnr01-lg font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
            <h2 className="text-tcnr01-lg font-medium mb-4">收件資訊</h2>
            <div className="space-y-2 text-tcnr01-base">
              <p className="font-medium">{order.recipientName}</p>
              <p className="text-tcnr01-gray-400">{order.recipientPhone}</p>
              <p className="text-tcnr01-gray-400">
                {[order.shippingPostalCode, order.shippingCity, order.shippingState, order.shippingAddress]
                  .filter(Boolean)
                  .join(' ')}
              </p>
              {order.notes && (
                <p className="text-tcnr01-gray-400 mt-2">
                  <span className="font-medium text-tcnr01-black">備註：</span>
                  {order.notes}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
            <h2 className="text-tcnr01-lg font-medium mb-4">付款資訊</h2>
            <div className="space-y-2 text-tcnr01-base">
              <div className="flex justify-between">
                <span className="text-tcnr01-gray-400">付款方式</span>
                <span>{PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tcnr01-gray-400">付款狀態</span>
                <span className="text-green-600 font-medium">
                  {order.paymentStatus === 'paid' ? '已付款' : order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Link to="/products">
            <Button variant="secondary" size="lg">繼續購物</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
