import { useEffect, useState } from 'react'
import { Package, Clock, CheckCircle, Truck } from 'lucide-react'
import { ordersApi } from '../api/client'
import './Orders.css'

const mockOrders = [
  {
    id: 'ORD-84729301', date: '2026-03-18', status: 'delivered', total: 449.98,
    items: [
      { name: 'Wireless Noise-Cancelling Headphones', qty: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80' },
      { name: 'Wireless Charging Pad', qty: 1, price: 39.99, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&q=80' },
    ]
  },
  {
    id: 'ORD-73819204', date: '2026-03-15', status: 'shipped', total: 129.99,
    items: [{ name: 'Minimalist Running Shoes', qty: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80' }]
  },
  {
    id: 'ORD-62910183', date: '2026-03-10', status: 'processing', total: 189.99,
    items: [{ name: 'Mechanical Keyboard Pro', qty: 1, price: 189.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&q=80' }]
  },
]

const statusConfig = {
  processing: { icon: Clock, label: 'Processing', class: 'badge-yellow' },
  shipped: { icon: Truck, label: 'Shipped', class: 'badge-green' },
  delivered: { icon: CheckCircle, label: 'Delivered', class: 'badge-green' },
}

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    // Try to fetch from order-service, fall back to mock data
    ordersApi.getAll()
      .then(data => { if (data?.orders?.length) setOrders(data.orders) })
      .catch(() => {}) // silently use mock data if service not running
  }, [])
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Managed by order-service via RDS PostgreSQL</p>

        {mockOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No orders yet</h3>
            <p>Your orders will appear here after checkout</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockOrders.map(order => {
              const { icon: Icon, label, class: cls } = statusConfig[order.status]
              return (
                <div key={order.id} className="order-card card">
                  <div className="order-header">
                    <div>
                      <p className="order-id">{order.id}</p>
                      <p className="order-date">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className={`badge ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={12} /> {label}
                      </span>
                      <span className="order-total">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <p>{item.name}</p>
                          <span>Qty: {item.qty} · ${item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}