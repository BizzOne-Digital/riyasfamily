import React from 'react'
import { Link } from 'react-router-dom'

// SVG Icons
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[white] text-[#32302a] mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center">
  <img
    src="/logo.png"
    alt="Riya's Family Dining"
    className="h-16 w-auto object-contain"
  />
</Link>
          <p className="text-sm text-[#32302a] leading-relaxed">
            Fresh food, family atmosphere. Dine-in, takeout, and delivery — always made with love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-body font-semibold uppercase tracking-wide text-xs mb-4 text-[#32302a]">Quick Links</h4>
          <ul className="space-y-2">
            {[['Home', '/'], ['Menu', '/menu'], ['Order Online', '/order'], ['Contact', '/contact']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-[#32302a] hover:text-[#fc820c] transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-body font-semibold uppercase tracking-wide text-xs mb-4 text-[#32302a]">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapIcon />
              <span>701 Robert Street East, Swift Current, SK S9H 5G1</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon />
              <a href="tel:+13069739472" className="hover:text-[#fc820c] transition-colors">306-973-9472</a>
              <span className="text-[#c8c6c5]">/</span>
              <a href="tel:+13063151114" className="hover:text-[#fc820c] transition-colors">306-315-1114</a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon />
              <a href="mailto:riyasfamilydining@gmail.com" className="hover:text-[#fc820c] transition-colors text-xs">
                riyasfamilydining@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#474746] px-6 py-4 text-center text-xs text-[#32302a]">
        © {new Date().getFullYear()} Riya's Family Dining. All rights reserved.
        <span className="mx-2">·</span>
        <Link to="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
      </div>
    </footer>
  )
}
