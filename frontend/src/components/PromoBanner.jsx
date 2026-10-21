import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const describe = p =>
  p.discountType === 'percent' ? `${p.discountValue}% off` : `$${Number(p.discountValue).toFixed(2)} off`

// Shows live promotions set up in Admin → Promotions. Renders nothing when there are none.
export default function PromoBanner({ showOrderLink = true }) {
  const [promos, setPromos] = useState([])

  useEffect(() => {
    api.get('/promotions').then(r => setPromos(r.data)).catch(() => {})
  }, [])

  if (promos.length === 0) return null

  return (
    <section className="max-w-screen-xl mx-auto px-4 my-6 grid gap-3 md:grid-cols-2">
      {promos.map(p => (
        <div key={p._id} className="rounded-xl bg-primary text-white p-4 flex items-center gap-4">
          <div className="text-3xl">🏷️</div>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-lg leading-tight">{p.title} · {describe(p)}</p>
            {p.description && <p className="text-sm opacity-90">{p.description}</p>}
            <p className="text-xs opacity-80 mt-1">
              {p.code ? <>Use code <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded">{p.code}</span> at checkout</> : 'Applied automatically at checkout'}
              {p.minOrder > 0 && ` · Min. order $${p.minOrder.toFixed(2)}`}
              {p.endDate && ` · Ends ${new Date(p.endDate).toLocaleDateString()}`}
            </p>
          </div>
          {showOrderLink && (
            <Link to="/order" className="bg-white text-primary text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap hover:bg-red-50">
              Order Now
            </Link>
          )}
        </div>
      ))}
    </section>
  )
}
