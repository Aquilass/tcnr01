import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { Button } from '@/components/ui'
import { formatPrice } from '@/utils/format'

export default function OrderConfirmationPage() {
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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-tcnr01-2xl font-medium mb-2">訂單已成立</h1>
          <p className="text-tcnr01-base text-tcnr01-gray-400">
            感謝您的購買！您的訂單編號為
          </p>
          <p className="text-tcnr01-lg font-medium mt-1">{order.orderNumber}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <h2 className="text-tcnr01-lg font-medium mb-6">訂單摘要</h2>

          <div className="space-y-4 pb-6 border-b border-tcnr01-gray-100">
            {order.items.map((item) => (
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

          <div className="space-y-3 py-6 border-b border-tcnr01-gray-100">
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
          </div>

          <div className="flex justify-between py-6">
            <span className="text-tcnr01-lg font-medium">總計</span>
            <span className="text-tcnr01-lg font-medium">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <h2 className="text-tcnr01-lg font-medium mb-4">收件資訊</h2>
          <div className="space-y-2 text-tcnr01-base">
            <p>{order.recipientName}</p>
            <p className="text-tcnr01-gray-400">{order.recipientPhone}</p>
            <p className="text-tcnr01-gray-400">
              {[order.shippingPostalCode, order.shippingCity, order.shippingState, order.shippingAddress]
                .filter(Boolean)
                .join(' ')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link to="/products">
            <Button variant="secondary" size="lg">繼續購物</Button>
          </Link>
          <Link to={`/orders/${order.id}`}>
            <Button size="lg">查看訂單</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
