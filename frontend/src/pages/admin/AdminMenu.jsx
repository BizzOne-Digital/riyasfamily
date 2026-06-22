import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api'

const categories = ['Appetizers', 'Main Courses', 'Family Meals', 'Desserts', 'Beverages']
const defaultForm = {
  name: '', description: '', price: '', category: 'Main Courses',
  image: '', imagePublicId: '', isAvailable: true, isPopular: false, dietaryTags: ''
}

// ── SVG Icons ──────────────────────────────────────────────
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
)
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
  </svg>
)
const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
)
const SpinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
)

// ── Image Uploader Component ────────────────────────────────
function ImageUploader({ value, publicId, onChange }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(value || '')

  // Sync preview when edit opens with existing image
  useEffect(() => { setPreview(value || '') }, [value])

  const doUpload = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, WebP allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5MB')
      return
    }

    setError('')
    setUploading(true)

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onChange({ url: res.data.url, publicId: res.data.publicId })
      setPreview(res.data.url)
    } catch (err) {
      setError('Upload failed. Please try again.')
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) doUpload(file)
  }

  const removeImage = async () => {
    if (publicId) {
      try { await api.delete('/upload', { data: { publicId } }) } catch {}
    }
    onChange({ url: '', publicId: '' })
    setPreview('')
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2 block">
        Menu Item Image
      </label>

      {preview ? (
        // Image Preview
        <div className="relative rounded-lg overflow-hidden border border-outline-variant">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <SpinIcon /> Uploading to Cloudinary...
              </div>
            </div>
          )}
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="bg-white/90 hover:bg-white text-on-surface px-3 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1 transition-colors"
              >
                <ImageIcon /> Change
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1 transition-colors"
              >
                <XIcon /> Remove
              </button>
            </div>
          )}
          {/* Cloudinary badge */}
          {!uploading && publicId && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3 fill-blue-400" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
              Cloudinary
            </div>
          )}
        </div>
      ) : (
        // Drop Zone
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-primary bg-red-50'
              : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <SpinIcon />
              <span className="text-sm font-medium">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-on-surface-variant">
              <div className="text-outline"><UploadIcon /></div>
              <p className="text-sm font-medium">Drop image here or click to browse</p>
              <p className="text-xs">JPEG, PNG, WebP — max 5MB</p>
              <p className="text-xs text-blue-500 mt-1">Uploaded to Cloudinary</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={e => doUpload(e.target.files[0])}
      />

      {error && (
        <p className="text-error text-xs mt-1 flex items-center gap-1">
          <XIcon /> {error}
        </p>
      )}
    </div>
  )
}

// ── Main AdminMenu Component ────────────────────────────────
export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [saving, setSaving] = useState(false)

  const fetchItems = () => {
    api.get('/menu/all').then(r => setItems(r.data)).catch(() => {})
  }
  useEffect(() => { fetchItems() }, [])

  const filtered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat)

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowForm(true) }
  const openEdit = item => {
    setForm({
      ...item,
      price: item.price.toString(),
      dietaryTags: (item.dietaryTags || []).join(', '),
      imagePublicId: item.imagePublicId || ''
    })
    setEditId(item._id)
    setShowForm(true)
  }

  const handleImageChange = ({ url, publicId }) => {
    setForm(p => ({ ...p, image: url, imagePublicId: publicId }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      dietaryTags: form.dietaryTags
        ? form.dietaryTags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    }
    try {
      if (editId) {
        await api.put(`/menu/${editId}`, payload)
      } else {
        await api.post('/menu', payload)
      }
      setShowForm(false)
      fetchItems()
    } catch {
      alert('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async item => {
    if (!confirm(`Delete "${item.name}"?`)) return
    // Also delete from Cloudinary if publicId exists
    if (item.imagePublicId) {
      try { await api.delete('/upload', { data: { publicId: item.imagePublicId } }) } catch {}
    }
    await api.delete(`/menu/${item._id}`)
    fetchItems()
  }

  const toggleAvailability = async item => {
    await api.put(`/menu/${item._id}`, { ...item, isAvailable: !item.isAvailable })
    fetchItems()
  }

  return (
    <AdminLayout title="Menu Management">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterCat === cat ? 'bg-primary text-white' : 'bg-white border border-outline-variant hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <PlusIcon /> Add Item
        </button>
      </div>

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-xl">{editId ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Uploader */}
              <ImageUploader
                value={form.image}
                publicId={form.imagePublicId}
                onChange={handleImageChange}
              />

              {/* Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Item Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1 block">Dietary Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.dietaryTags}
                  onChange={e => setForm(p => ({ ...p, dietaryTags: e.target.value }))}
                  placeholder="e.g. Vegan, Gluten-Free, Spicy"
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={e => setForm(p => ({ ...p, isPopular: e.target.checked }))}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Mark as Popular ★</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <><SpinIcon /> Saving...</> : (editId ? 'Save Changes' : 'Add Item')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Items Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <div className="text-5xl mb-3">🍽️</div>
          <p>No items yet. Click "Add Item" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item._id} className="card overflow-hidden">
              {/* Image */}
              <div className="relative h-44 bg-surface-container">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-outline">🍽️</div>
                )}
                {/* Cloudinary badge */}
                {item.imagePublicId && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3 fill-blue-400" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
                    CDN
                  </div>
                )}
                {/* Unavailable overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">UNAVAILABLE</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-on-surface text-sm leading-tight">{item.name}</h3>
                  <span className="text-primary font-bold text-base whitespace-nowrap">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{item.description}</p>

                <div className="flex items-center gap-1 flex-wrap mb-3">
                  <span className="category-badge">{item.category}</span>
                  {item.isPopular && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">★ Popular</span>}
                  {item.dietaryTags?.map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">{tag}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border transition-all ${
                      item.isAvailable
                        ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {item.isAvailable ? '✓ Available' : '✗ Hidden'}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-outline-variant transition-colors text-on-surface"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-error"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
