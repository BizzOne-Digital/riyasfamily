import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api'

const inputCls = 'w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary'

export default function AdminSettings() {
  const [methods, setMethods] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/settings').then(r => setMethods(r.data.paymentMethods)).catch(() => {})
  }, [])

  const update = (i, patch) => { setSaved(false); setMethods(prev => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m)) }

  const save = async e => {
    e.preventDefault()
    if (!methods.some(m => m.isActive)) {
      alert('Keep at least one payment method turned on, or customers cannot check out.')
      return
    }
    setSaving(true)
    try {
      const r = await api.put('/settings', { paymentMethods: methods })
      setMethods(r.data.paymentMethods)
      setSaved(true)
    } catch {
      alert('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Payment Methods">
      <form onSubmit={save} className="max-w-2xl">
        <p className="text-sm text-on-surface-variant mb-6">
          Choose which payment options customers see at checkout. Instructions are shown to the customer when they pick that method.
        </p>

        <div className="space-y-3 mb-4">
          {methods.map((m, i) => (
            <div key={m._id || i} className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none flex-shrink-0">
                  <input type="checkbox" checked={m.isActive} onChange={e => update(i, { isActive: e.target.checked })} className="accent-primary w-4 h-4" />
                  On
                </label>
                <input value={m.name} onChange={e => update(i, { name: e.target.value })} placeholder="e.g. Pay at Pickup" className={inputCls} required />
                <button type="button" onClick={() => { setSaved(false); setMethods(prev => prev.filter((_, idx) => idx !== i)) }} className="text-error text-sm px-2">
                  Remove
                </button>
              </div>
              <textarea
                value={m.instructions || ''}
                onChange={e => update(i, { instructions: e.target.value })}
                rows={2}
                placeholder="Instructions for the customer (optional), e.g. e-Transfer email address"
                className={`${inputCls} resize-none`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => { setSaved(false); setMethods(prev => [...prev, { name: '', instructions: '', isActive: true }]) }}
          className="text-sm font-semibold text-primary border border-dashed border-primary rounded-lg w-full py-2 mb-6 hover:bg-red-50"
        >
          + Add payment method
        </button>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          {saved && <span className="text-sm text-green-700">Saved ✓</span>}
        </div>
      </form>
    </AdminLayout>
  )
}
