import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api'

const categories = ['All', 'Appetizers', 'Main Courses', 'Family Meals', 'Desserts', 'Beverages']

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
  </svg>
)

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    const params = activeCategory !== 'All' ? { category: activeCategory } : {}
    api.get('/menu', { params })
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  const setCategory = cat => {
    if (cat === 'All') setSearchParams({})
    else setSearchParams({ category: cat })
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      {/* Header */}
      <div className="bg-surface-container-low py-10 px-6 text-center">
        <h1 className="font-headline font-bold text-4xl text-primary mb-2">Our Menu</h1>
        <p className="text-on-surface-variant">Fresh, authentic dishes for every occasion</p>
        <div className="w-16 h-1 bg-secondary mx-auto mt-3 rounded-full" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 mt-8">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <span className="flex items-center gap-1 text-on-surface-variant text-sm mr-2">
            <FilterIcon /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-on-surface border-outline-variant hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading menu...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg mb-2">No items available right now.</p>
            <p className="text-sm text-on-surface-variant">Please check back soon or call us at 306-973-9472</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item._id} className="card fade-in">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-surface-container-high flex items-center justify-center text-4xl">🍽️</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-headline font-semibold text-base text-on-surface leading-tight">{item.name}</h3>
                    <span className="text-primary font-bold text-lg whitespace-nowrap">${item.price.toFixed(2)}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="category-badge">{item.category}</span>
                    {item.dietaryTags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
