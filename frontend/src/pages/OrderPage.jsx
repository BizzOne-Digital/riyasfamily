import React, { useEffect, useState } from 'react'
import api from '../api'

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
)
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13H5v-2h14v2z"/>
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
)

const categories = ['All', 'Appetizers', 'Main Courses', 'Family Meals', 'Desserts', 'Beverages']

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [orderType, setOrderType] = useState('Takeout')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })
  const [step, setStep] = useState('menu') // 'menu' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/menu').then(res => setMenuItems(res.data)).catch(() => {})
  }, [])

  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory)

  const addToCart = item => {
    setCart(prev => {
      const existing = prev.find(c => c._id === item._id)
      if (existing) return prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c._id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0))
  }

  const totalAmount = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  const placeOrder = async () => {
    setLoading(true)
    try {
      await api.post('/orders', {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        orderType,
        deliveryAddress: orderType === 'Delivery' ? form.address : '',
        notes: form.notes,
        items: cart.map(c => ({ menuItem: c._id, name: c.name, price: c.price, quantity: c.qty })),
        totalAmount,
      })
      setStep('success')
      setCart([])
    } catch {
      alert('Could not place order. Please call us at 306-973-9472.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') return (
    <main className="pt-24 pb-16 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-headline font-bold text-3xl text-primary mb-3">Order Placed!</h2>
        <p className="text-on-surface-variant mb-6">Thank you! We've received your order and will prepare it shortly. You'll be contacted at {form.phone}.</p>
        <button onClick={() => { setStep('menu'); setForm({ name: '', email: '', phone: '', address: '', notes: '' }) }} className="btn-primary">
          Place Another Order
        </button>
      </div>
    </main>
  )

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="bg-surface-container-low py-8 px-6 text-center mb-6">
        <h1 className="font-headline font-bold text-4xl text-primary mb-1">Order Online</h1>
        <p className="text-on-surface-variant text-sm">Choose your items, then complete checkout</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Menu Column */}
        <div className="flex-1">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCategory === cat ? 'bg-primary text-white border-primary' : 'border-outline-variant hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(item => {
              const inCart = cart.find(c => c._id === item._id)
              return (
                <div key={item._id} className="card flex gap-3 p-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-surface-container rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-on-surface truncate">{item.name}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item._id, -1)} className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center hover:bg-outline-variant"><MinusIcon /></button>
                          <span className="text-sm font-bold w-4 text-center">{inCart.qty}</span>
                          <button onClick={() => updateQty(item._id, 1)} className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-red-800"><PlusIcon /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-800 transition-colors">
                          <PlusIcon /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cart / Checkout */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card p-5 sticky top-20">
            <h2 className="font-headline font-semibold text-xl mb-4 flex items-center gap-2">
              <CartIcon /> Your Order
            </h2>

            {step === 'menu' ? (
              <>
                {cart.length === 0 ? (
                  <p className="text-on-surface-variant text-sm text-center py-8">Add items from the menu to get started.</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map(c => (
                        <div key={c._id} className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1 bg-surface-container rounded-full px-2 py-0.5">
                            <button onClick={() => updateQty(c._id, -1)}><MinusIcon /></button>
                            <span className="w-4 text-center font-bold">{c.qty}</span>
                            <button onClick={() => updateQty(c._id, 1)}><PlusIcon /></button>
                          </div>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="font-semibold">${(c.price * c.qty).toFixed(2)}</span>
                          <button onClick={() => setCart(prev => prev.filter(i => i._id !== c._id))} className="text-error">
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-outline-variant pt-3 mb-4">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => setStep('checkout')} className="btn-primary w-full text-center">
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* Order Type */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Order Type</label>
                  <div className="flex gap-2">
                    {['Takeout', 'Delivery', 'Dine-in'].map(t => (
                      <button
                        key={t}
                        onClick={() => setOrderType(t)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                          orderType === t ? 'bg-primary text-white border-primary' : 'border-outline-variant hover:border-primary'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone Number', 'tel']].map(([field, label, type]) => (
                  <div key={field}>
                    <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                ))}

                {orderType === 'Delivery' && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Delivery Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="border-t border-outline-variant pt-3">
                  <div className="flex justify-between font-bold mb-3">
                    <span>Total</span>
                    <span className="text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={loading || !form.name || !form.email || !form.phone}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                  <button onClick={() => setStep('menu')} className="mt-2 w-full text-center text-sm text-on-surface-variant hover:text-primary">
                    ← Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
