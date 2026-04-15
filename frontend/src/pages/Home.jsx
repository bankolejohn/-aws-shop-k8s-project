import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import './Home.css'

const featured = products.filter(p => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 4)
const deals = products.filter(p => p.badge === 'Sale').slice(0, 4)

const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: 'AWS Cognito protected' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
]

export default function Home() {
  const [toast, setToast] = useState(null)

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="badge badge-red" style={{ marginBottom: 16 }}>AWS Enterprise Platform</span>
            <h1>Shop Smarter,<br />Ship Faster</h1>
            <p>A production-grade ecommerce platform built on AWS microservices, Kubernetes, and enterprise DevOps practices.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?category=electronics" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>
                Electronics
              </Link>
            </div>
            <div className="hero-stats">
              <div><strong>12K+</strong><span>Products</span></div>
              <div><strong>50K+</strong><span>Customers</span></div>
              <div><strong>99.9%</strong><span>Uptime</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card card">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" alt="Featured product" />
              <div className="hero-card-info">
                <p>Best Seller</p>
                <h3>Wireless Headphones</h3>
                <span className="price">$299.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="perks">
        <div className="container">
          <div className="grid-4">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="perk-item card">
                <Icon size={22} color="var(--accent)" />
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="page-title">Featured Products</h2>
              <p className="page-subtitle">Handpicked top sellers and new arrivals</p>
            </div>
            <Link to="/products" className="btn btn-outline">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-4">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToast={setToast} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div>
            <h2>Up to 40% Off Sale Items</h2>
            <p>Limited time deals on top products. Don't miss out.</p>
          </div>
          <Link to="/products?category=all&badge=Sale" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Shop Sale <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Deals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="page-title">Today's Deals</h2>
              <p className="page-subtitle">Save big on these limited-time offers</p>
            </div>
            <Link to="/products" className="btn btn-outline">See All Deals <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-4">
            {deals.map(p => (
              <ProductCard key={p.id} product={p} onAddToast={setToast} />
            ))}
          </div>
        </div>
      </section>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  )
}