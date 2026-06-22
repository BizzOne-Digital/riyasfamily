import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api'

const statuses = ['Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']

const statusColors = {
  Received: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-yellow-100 text-yellow-800',
  Ready: 'bg-green-100 text-green-800',
  'Out for Delivery': 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    const params = filter !== 'All' ? { status: filter } : {}
    api.get('/orders', { params }).then(r => setOrders(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filter])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status })
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
  }

  return (
    <AdminLayout title="Orders Management">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['All', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === s ? 'bg-primary text-white' : 'bg-white border border-outline-variant hover:border-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-on-surface-variant">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-on-surface">{order.customerName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded-full">{order.orderType}</span>
                  </div>
                  <div className="text-xs text-on-surface-variant space-y-0.5 mb-3">
                    <p>{order.customerPhone} · {order.customerEmail}</p>
                    {order.deliveryAddress && <p>Delivery: {order.deliveryAddress}</p>}
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  {/* Items */}
                  <div className="text-sm text-on-surface space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.qty}x {item.name}</span>
                        <span className="text-on-surface-variant">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && <p className="text-xs mt-2 italic text-on-surface-variant">Note: {order.notes}</p>}
                </div>

                {/* Right: Total + Actions */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-xl text-primary mb-3">${order.totalAmount.toFixed(2)}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">Update Status</p>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className="border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
