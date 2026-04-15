import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { items, total, removeFromCart, updateQty, clearCart } = useCart()

  if (items.length === 0) return (
    <div className="page">
      <div className="container empty-state">
        <ShoppingBag size={64} />
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )

  const shipping = total >= 50 ? 0 : 9.99
  const tax = total * 0.08
  const orderTotal = total + shipping + tax

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''}</p>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item card">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <p className="product-category">{item.category}</p>
                  <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <span className="price">${item.price}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                  </div>
                  <span className="cart-item-total">${(item.price * item.qty).toFixed(2)}</span>
                  <button className="btn btn-ghost remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-ghost" onClick={clearCart} style={{ marginTop: 8 }}>
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="divider" />
            <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-note">
                Add ${(50 - total).toFixed(2)} more for free shipping
              </p>
            )}
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 16 }}>
              Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}