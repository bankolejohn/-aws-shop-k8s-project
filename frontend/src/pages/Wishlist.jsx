import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { products } from '../data/products'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { useState } from 'react'

export default function Wishlist() {
  const { items } = useWishlist()
  const [toast, setToast] = useState(null)
  const wished = products.filter(p => items.includes(p.id))

  if (wished.length === 0) return (
    <div className="page">
      <div className="container empty-state">
        <Heart size={64} />
        <h3>Your wishlist is empty</h3>
        <p>Save products you love for later</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Wishlist</h1>
        <p className="page-subtitle">{wished.length} saved item{wished.length !== 1 ? 's' : ''}</p>
        <div className="grid-4">
          {wished.map(p => <ProductCard key={p.id} product={p} onAddToast={setToast} />)}
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}