import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { formatPrice } from '@/utils/format'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '處理中', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: '已確認', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: '已出貨', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: '已送達', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' },
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-tcnr01-2xl font-medium mb-8">我的訂單</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-tcnr01-xl font-medium mb-3">還沒有訂單</h2>
            <p className="text-tcnr01-base text-tcnr01-gray-400 mb-8">
              快去挑選你喜歡的商品吧！
            </p>
            <Link to="/products">
              <button className="bg-tcnr01-black text-white px-8 py-3 rounded-tcnr01 text-tcnr01-base font-medium hover:bg-tcnr01-gray-800 transition-colors">
                開始購物
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = STATUS_MAP[order.status] || {
                label: order.status,
                color: 'bg-gray-100 text-gray-700',
              }

              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 hover:border-tcnr01-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {order.firstItemImage && (
                      <img
                        src={order.firstItemImage}
                        alt=""
                        className="w-16 h-16 object-cover rounded-tcnr01"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-tcnr01-base font-medium">{order.orderNumber}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-tcnr01-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-tcnr01-sm text-tcnr01-gray-400">
                        {order.itemCount} 件商品 ・{' '}
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-tcnr01-base font-medium">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
