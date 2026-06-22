import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api'

const StatCard = ({ label, value, color }) => (
  <div className="card p-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">{label}</p>
    <p className={`font-headline font-bold text-3xl ${color}`}>{value}</p>
  </div>
)

const statusColors = {
  Received: 'status-badge-received',
  Preparing: 'status-badge-preparing',
  Ready: 'status-badge-ready',
  'Out for Delivery': 'status-badge-received',
  Delivered: 'status-badge-delivered',
  Cancelled: 'status-badge-cancelled',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    api.get('/orders/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/orders').then(r => setRecentOrders(r.data.slice(0, 5))).catch(() => {})
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? '—'} color="text-primary" />
        <StatCard label="Today's Orders" value={stats?.todayOrders ?? '—'} color="text-secondary" />
        <StatCard label="Pending" value={stats?.pendingOrders ?? '—'} color="text-yellow-600" />
        <StatCard label="Total Revenue" value={stats ? `$${stats.totalRevenue.toFixed(2)}` : '—'} color="text-green-700" />
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="font-semibold text-on-surface">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                {['Customer', 'Type', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id} className="border-b border-outline-variant hover:bg-surface-container-low">
                  <td className="px-6 py-3 font-medium">{order.customerName}</td>
                  <td className="px-6 py-3">{order.orderType}</td>
                  <td className="px-6 py-3 font-semibold text-primary">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[order.status] || ''}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
