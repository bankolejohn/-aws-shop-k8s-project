import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ArrowLeft, Truck, Shield, Package } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(null)

  if (!product) return (
    <div className="page">
      <div className="container empty-state">
        <h3>Product not found</h3>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Products</Link>
      </div>
    </div>
  )

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating))
  const wished = has(product.id)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setToast(`${qty}x ${product.name} added to cart`)
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="product-detail">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
            {product.badge && (
              <span className={`product-badge badge ${product.badge === 'Sale' ? 'badge-red' : product.badge === 'New' ? 'badge-green' : 'badge-yellow'}`}>
                {product.badge}
              </span>
            )}
          </div>

          <div className="detail-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>

            <div className="detail-rating">
              {stars.map((filled, i) => (
                <Star key={i} size={16} className="star" fill={filled ? 'currentColor' : 'none'} />
              ))}
              <span>{product.rating}</span>
              <span className="text-muted">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="detail-price">
              <span className="price">${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="price-old">${product.oldPrice}</span>
                  <span className="badge badge-red">
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 10
                ? <span className="badge badge-green">In Stock ({product.stock} available)</span>
                : product.stock > 0
                ? <span className="badge badge-yellow">Low Stock ({product.stock} left)</span>
                : <span className="badge badge-red">Out of Stock</span>
              }
            </div>

            <div className="detail-qty">
              <label>Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleAdd}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                className={`btn btn-outline wish-toggle ${wished ? 'wished' : ''}`}
                onClick={() => toggle(product.id)}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="detail-perks">
              <div><Truck size={15} /> Free shipping on orders over $50</div>
              <div><Shield size={15} /> Secure checkout with AWS Cognito</div>
              <div><Package size={15} /> 30-day hassle-free returns</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ marginTop: 64 }}>
            <h2 className="page-title" style={{ marginBottom: 8 }}>Related Products</h2>
            <p className="page-subtitle">More from {product.category}</p>
            <div className="grid-4">
              {related.map(p => <ProductCard key={p.id} product={p} onAddToast={setToast} />)}
            </div>
          </section>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}