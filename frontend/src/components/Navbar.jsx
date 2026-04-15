import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Search, Menu, X, Zap, User, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, logout, isLoggedIn } = useAuth()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Zap size={22} />
          <span>ShopAWS</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} />
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishCount > 0 && <span className="badge-count">{wishCount}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {count > 0 && <span className="badge-count">{count}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-avatar">
                <User size={15} />
                <span>{user.firstName || user.email.split('@')[0]}</span>
              </div>
              <button className="btn btn-ghost logout-btn" onClick={handleLogout} aria-label="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              Sign In
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}