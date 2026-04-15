import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './ProductCard.css'

export default function ProductCard({ product, onAddToast }) {
  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    onAddToast?.(`${product.name} added to cart`)
  }

  const handleWish = (e) => {
    e.preventDefault()
    toggle(product.id)
  }

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating))

  return (
    <Link to={`/products/${product.id}`} className="product-card card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && (
          <span className={`product-badge badge ${
            product.badge === 'Sale' ? 'badge-red' :
            product.badge === 'New' ? 'badge-green' :
            product.badge === 'Low Stock' ? 'badge-yellow' : 'badge-red'
          }`}>{product.badge}</span>
        )}
        <button
          className={`wish-btn ${wished ? 'wished' : ''}`}
          onClick={handleWish}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {stars.map((filled, i) => (
            <Star key={i} size={13} className="star" fill={filled ? 'currentColor' : 'none'} />
          ))}
          <span>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-footer">
          <div>
            <span className="price">${product.price}</span>
            {product.oldPrice && <span className="price-old"> ${product.oldPrice}</span>}
          </div>
          <button className="btn btn-primary add-btn" onClick={handleAdd}>
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </Link>
  )
}