import React, { useEffect, useState } from 'react'
import api from '../api'
import PromoBanner from '../components/PromoBanner'

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

const categories = ['All', 'Appetizers', 'Soups', 'Salads', 'Burgers', 'Sandwiches & Wraps', 'Poutines', 'Lighter Meals', 'Main Entrees', 'Pastas & Bowls', 'Gluten Free']

// Popup for picking sides / add-ons before adding to cart
function OptionsModal({ item, onClose, onAdd }) {
  const [picked, setPicked] = useState({}) // { groupName: [optionName] }

  const toggle = (group, name) => {
    setPicked(prev => {
      const current = prev[group.name] || []
      if (current.includes(name)) return { ...prev, [group.name]: current.filter(n => n !== name) }
      if (group.maxSelect === 1) return { ...prev, [group.name]: [name] }
      if (group.maxSelect > 0 && current.length >= group.maxSelect) return prev
      return { ...prev, [group.name]: [...current, name] }
    })
  }

  const options = item.optionGroups.flatMap(g =>
    (picked[g.name] || []).map(name => ({ group: g.name, name, price: g.options.find(o => o.name === name)?.price || 0 }))
  )
  const missing = item.optionGroups.filter(g => g.required && !(picked[g.name] || []).length)
  const price = item.price + options.reduce((s, o) => s + o.price, 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:px-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="font-headline font-semibold text-xl">{item.name}</h2>
          {item.description && <p className="text-xs text-on-surface-variant mt-1">{item.description}</p>}
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5">
          {item.optionGroups.map(g => (
            <div key={g.name}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{g.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${g.required ? 'bg-red-50 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  {g.required ? 'Required' : 'Optional'}{g.maxSelect > 1 ? ` · up to ${g.maxSelect}` : g.maxSelect === 1 ? ' · pick 1' : ''}
                </span>
              </div>
              <div className="space-y-1.5">
                {g.options.map(o => {
                  const checked = (picked[g.name] || []).includes(o.name)
                  return (
                    <label key={o.name} className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer ${checked ? 'border-primary bg-red-50' : 'border-outline-variant'}`}>
                      <input
                        type={g.maxSelect === 1 ? 'radio' : 'checkbox'}
                        name={g.name}
                        checked={checked}
                        onChange={() => toggle(g, o.name)}
                        className="accent-primary"
                      />
                      <span className="flex-1">{o.name}</span>
                      {o.price > 0 && <span className="text-on-surface-variant">+${o.price.toFixed(2)}</span>}
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-outline-variant flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button
            onClick={() => onAdd(options)}
            disabled={missing.length > 0}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title={missing.length ? `Please choose: ${missing.map(g => g.name).join(', ')}` : ''}
          >
            Add · ${price.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [orderType, setOrderType] = useState('Takeout')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })
  const [step, setStep] = useState('menu') // 'menu' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false)
  const [optionItem, setOptionItem] = useState(null) // item being customised
  const [paymentMethods, setPaymentMethods] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoCode, setPromoCode] = useState('') // applied code
  const [quote, setQuote] = useState(null) // server-calculated totals
  const [quoteError, setQuoteError] = useState('')

  useEffect(() => {
    api.get('/menu').then(res => setMenuItems(res.data)).catch(() => {})
    api.get('/settings/payment-methods').then(res => {
      setPaymentMethods(res.data)
      if (res.data.length === 1) setPaymentMethod(res.data[0].name)
    }).catch(() => {})
  }, [])

  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory)

  // Same item with different choices = separate cart lines
  const addToCart = (item, options = []) => {
    const key = item._id + '|' + options.map(o => `${o.group}:${o.name}`).join(',')
    const price = item.price + options.reduce((s, o) => s + o.price, 0)
    setCart(prev => {
      const existing = prev.find(c => c.key === key)
      if (existing) return prev.map(c => c.key === key ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { key, _id: item._id, name: item.name, price, options, qty: 1 }]
    })
  }

  const handleAdd = item => (item.optionGroups?.length ? setOptionItem(item) : addToCart(item))

  const updateQty = (key, delta) => {
    setCart(prev => prev.map(c => c.key === key ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0))
  }

  const totalAmount = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const orderLines = cart.map(c => ({ menuItem: c._id, quantity: c.qty, options: c.options.map(({ group, name }) => ({ group, name })) }))

  // Ask the server for the real total (applies promotions) whenever checkout is shown or the cart/code changes
  useEffect(() => {
    if (step !== 'checkout' || cart.length === 0) return
    api.post('/orders/quote', { items: orderLines, promoCode })
      .then(res => setQuote(res.data))
      .catch(err => {
        setQuoteError(err.response?.data?.message || 'Could not apply promo code')
        if (promoCode) setPromoCode('')
      })
  }, [step, cart, promoCode])

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
        items: orderLines,
        promoCode,
        paymentMethod,
      })
      setStep('success')
      setCart([])
      setQuote(null)
      setPromoCode('')
      setPromoInput('')
    } catch (err) {
      alert(err.response?.data?.message || 'Could not place order. Please call us at 306-973-9472.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPayment = paymentMethods.find(m => m.name === paymentMethod)

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

      <PromoBanner showOrderLink={false} />

      {optionItem && (
        <OptionsModal
          item={optionItem}
          onClose={() => setOptionItem(null)}
          onAdd={options => { addToCart(optionItem, options); setOptionItem(null) }}
        />
      )}

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
              const hasOptions = item.optionGroups?.length > 0
              const inCart = !hasOptions && cart.find(c => c._id === item._id)
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
                          <button onClick={() => updateQty(inCart.key, -1)} className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center hover:bg-outline-variant"><MinusIcon /></button>
                          <span className="text-sm font-bold w-4 text-center">{inCart.qty}</span>
                          <button onClick={() => updateQty(inCart.key, 1)} className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-red-800"><PlusIcon /></button>
                        </div>
                      ) : (
                        <button onClick={() => handleAdd(item)} className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-800 transition-colors">
                          <PlusIcon /> {hasOptions ? 'Choose' : 'Add'}
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
                        <div key={c.key} className="text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-surface-container rounded-full px-2 py-0.5">
                              <button onClick={() => updateQty(c.key, -1)}><MinusIcon /></button>
                              <span className="w-4 text-center font-bold">{c.qty}</span>
                              <button onClick={() => updateQty(c.key, 1)}><PlusIcon /></button>
                            </div>
                            <span className="flex-1 truncate">{c.name}</span>
                            <span className="font-semibold">${(c.price * c.qty).toFixed(2)}</span>
                            <button onClick={() => setCart(prev => prev.filter(i => i.key !== c.key))} className="text-error">
                              <TrashIcon />
                            </button>
                          </div>
                          {c.options.length > 0 && (
                            <p className="text-xs text-on-surface-variant pl-16">{c.options.map(o => o.name).join(', ')}</p>
                          )}
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

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Payment Method</label>
                  <div className="space-y-1.5">
                    {paymentMethods.map(m => (
                      <label key={m.name} className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer ${paymentMethod === m.name ? 'border-primary bg-red-50' : 'border-outline-variant'}`}>
                        <input type="radio" name="payment" checked={paymentMethod === m.name} onChange={() => setPaymentMethod(m.name)} className="accent-primary" />
                        {m.name}
                      </label>
                    ))}
                  </div>
                  {selectedPayment?.instructions && <p className="text-xs text-on-surface-variant mt-1">{selectedPayment.instructions}</p>}
                </div>

                {/* Promo Code */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 min-w-0 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => { setQuoteError(''); setPromoCode(promoInput.trim()) }}
                      disabled={!promoInput.trim()}
                      className="px-3 py-2 text-xs font-semibold rounded-lg border border-primary text-primary disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </div>
                  {quoteError && <p className="text-xs text-error mt-1">{quoteError}</p>}
                </div>

                <div className="border-t border-outline-variant pt-3">
                  {quote?.discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>${quote.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 text-green-700">
                        <span>{quote.promotion?.title}</span>
                        <span>-${quote.discount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-bold mb-3">
                    <span>Total</span>
                    <span className="text-primary">${(quote ? quote.totalAmount : totalAmount).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={loading || !form.name || !form.email || !form.phone || !paymentMethod}
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
