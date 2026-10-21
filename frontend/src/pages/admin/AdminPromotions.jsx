import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api'

const defaultForm = {
  title: '', description: '', code: '', discountType: 'percent', discountValue: '',
  minOrder: '', startDate: '', endDate: '', isActive: true, showBanner: true
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary'
const labelCls = 'text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block'

const toDateInput = d => (d ? new Date(d).toISOString().slice(0, 10) : '')

function promoStatus(p) {
  const now = new Date()
  if (!p.isActive) return ['Paused', 'bg-gray-100 text-gray-700']
  if (p.startDate && now < new Date(p.startDate)) return ['Scheduled', 'bg-blue-100 text-blue-800']
  if (p.endDate && now > new Date(p.endDate)) return ['Expired', 'bg-red-100 text-red-700']
  return ['Live', 'bg-green-100 text-green-800']
}

const describeDiscount = p =>
  p.discountType === 'percent' ? `${p.discountValue}% off` : `$${Number(p.discountValue).toFixed(2)} off`

export default function AdminPromotions() {
  const [promos, setPromos] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchPromos = () => api.get('/promotions/all').then(r => setPromos(r.data)).catch(() => {})
  useEffect(() => { fetchPromos() }, [])

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowForm(true) }
  const openEdit = p => {
    setForm({
      ...defaultForm, ...p,
      code: p.code || '',
      minOrder: p.minOrder ? String(p.minOrder) : '',
      discountValue: String(p.discountValue),
      startDate: toDateInput(p.startDate),
      endDate: toDateInput(p.endDate),
    })
    setEditId(p._id)
    setShowForm(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: parseFloat(form.discountValue),
      minOrder: parseFloat(form.minOrder) || 0,
      startDate: form.startDate ? new Date(form.startDate + 'T00:00:00') : null,
      endDate: form.endDate ? new Date(form.endDate + 'T23:59:59') : null,
    }
    try {
      if (editId) await api.put(`/promotions/${editId}`, payload)
      else await api.post('/promotions', payload)
      setShowForm(false)
      fetchPromos()
    } catch {
      alert('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async p => {
    await api.put(`/promotions/${p._id}`, { isActive: !p.isActive })
    fetchPromos()
  }

  const deletePromo = async p => {
    if (!confirm(`Delete promotion "${p.title}"?`)) return
    await api.delete(`/promotions/${p._id}`)
    fetchPromos()
  }

  return (
    <AdminLayout title="Promotions">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-sm text-on-surface-variant max-w-xl">
          Run a deal with a promo code, or leave the code empty to apply it automatically at checkout.
          Live promotions with "Show on website" appear as a banner on the home and order pages.
        </p>
        <button onClick={openAdd} className="btn-primary text-sm">+ New Promotion</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <h2 className="font-headline font-semibold text-xl">{editId ? 'Edit Promotion' : 'New Promotion'}</h2>

            <div>
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Family Night 10% Off" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Description (shown to customers)</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Discount Type</label>
                <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))} className={inputCls}>
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed amount ($)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Discount {form.discountType === 'percent' ? '(%)' : '($)'} *</label>
                <input type="number" step="0.01" min="0" max={form.discountType === 'percent' ? 100 : undefined} value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} className={inputCls} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Promo Code</label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="Blank = automatic" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Minimum Order ($)</label>
                <input type="number" step="0.01" min="0" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} placeholder="0" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-primary w-4 h-4" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={form.showBanner} onChange={e => setForm(p => ({ ...p, showBanner: e.target.checked }))} className="accent-primary w-4 h-4" />
                Show on website
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Saving...' : 'Save Promotion'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {promos.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <div className="text-5xl mb-3">🏷️</div>
          <p>No promotions yet. Click "New Promotion" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map(p => {
            const [label, color] = promoStatus(p)
            return (
              <div key={p._id} className="card p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-on-surface">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${color}`}>{label}</span>
                </div>
                {p.description && <p className="text-xs text-on-surface-variant mb-2">{p.description}</p>}
                <p className="text-primary font-bold text-lg">{describeDiscount(p)}</p>
                <div className="text-xs text-on-surface-variant space-y-0.5 my-3">
                  <p>Code: {p.code ? <span className="font-mono font-semibold text-on-surface">{p.code}</span> : 'Automatic (no code)'}</p>
                  {p.minOrder > 0 && <p>Minimum order: ${p.minOrder.toFixed(2)}</p>}
                  <p>
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'Now'} → {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'No end date'}
                  </p>
                  {!p.showBanner && <p>Hidden from website banner</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(p)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold border border-outline-variant hover:border-primary">
                    {p.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(p)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold bg-surface-container hover:bg-outline-variant">Edit</button>
                  <button onClick={() => deletePromo(p)} className="flex-1 text-xs py-1.5 rounded-lg font-semibold bg-red-50 text-error hover:bg-red-100">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}
