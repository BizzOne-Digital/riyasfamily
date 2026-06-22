import React, { useState } from 'react'
import api from '../api'

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/>
  </svg>
)

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      {/* Header */}
      <div className="bg-surface-container-low py-10 px-6 text-center mb-10">
        <h1 className="font-headline font-bold text-4xl text-primary mb-2">Contact Us</h1>
        <p className="text-on-surface-variant">We'd love to hear from you. Reach out anytime.</p>
        <div className="w-16 h-1 bg-secondary mx-auto mt-3 rounded-full" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="font-headline font-semibold text-2xl mb-6 text-on-surface">Get In Touch</h2>
          <div className="space-y-6">
            {[
              { icon: <MapIcon />, label: 'Address', content: '701 Robert Street East\nSwift Current, SK S9H 5G1' },
              { icon: <PhoneIcon />, label: 'Phone', content: '306-973-9472\n306-315-1114' },
              { icon: <MailIcon />, label: 'Email', content: 'riyasfamilydining@gmail.com' },
              { icon: <ClockIcon />, label: 'Hours', content: 'Monday – Sunday\n11:00 AM – 9:00 PM' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="text-primary mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-wide text-on-surface-variant mb-1">{item.label}</p>
                  <p className="text-on-surface whitespace-pre-line text-sm">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 rounded-lg overflow-hidden shadow-md">
            <iframe
              title="Riya's Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.0!2d-107.795!3d50.285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDE3JzA2LjAiTiAxMDfCsDQ3JzQyLjAiVw!5e0!3m2!1sen!2sca!4v1234567890"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="font-headline font-semibold text-2xl mb-6 text-on-surface">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number (optional)', 'tel']].map(([field, label, type]) => (
              <div key={field}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required={field !== 'phone'}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
                className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
                Something went wrong. Please call us directly at 306-973-9472.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
