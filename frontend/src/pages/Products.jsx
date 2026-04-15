import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import './Products.css'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [toast, setToast] = useState(null)
  const [sort, setSort] = useState('default')
  const [priceMax, setPriceMax] = useState(1000)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams)
    if (cat === 'all') p.delete('category')
    else p.set('category', cat)
    setSearchParams(p)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (searchQuery) list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.includes(searchQuery.toLowerCase()))
    )
    list = list.filter(p => p.price <= priceMax)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'reviews') list.sort((a, b) => b.reviews - a.reviews)
    return list
  }, [activeCategory, searchQuery, sort, priceMax])

  return (
    <div className="page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="page-title">
              {searchQuery ? `Results for "${searchQuery}"` : categories.find(c => c.id === activeCategory)?.name}
            </h1>
            <p className="page-subtitle">{filtered.length} products found</p>
          </div>
          <div className="products-controls">
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto' }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            <button className="btn btn-outline" onClick={() => setFiltersOpen(o => !o)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`products-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="btn btn-ghost" onClick={() => setFiltersOpen(false)}><X size={16} /></button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h4>Max Price: ${priceMax}</h4>
              <input
                type="range" min={10} max={1000} step={10}
                value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                style={{ padding: 0, border: 'none', background: 'none' }}
              />
              <div className="price-range-labels">
                <span>$10</span><span>$1000</span>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="products-grid">
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <X size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onAddToast={setToast} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}