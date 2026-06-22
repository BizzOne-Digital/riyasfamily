import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// SVG Icons
const DashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
)
const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
)
const MenuIcon2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
  </svg>
)
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <DashIcon /> },
  { to: '/admin/orders', label: 'Orders', icon: <OrdersIcon /> },
  { to: '/admin/menu', label: 'Menu Items', icon: <MenuIcon2 /> },
]

export default function AdminLayout({ children, title }) {
  const location = useLocation()
  const navigate = useNavigate()
  const adminName = localStorage.getItem('adminName') || 'Admin'

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#32302a] text-white flex flex-col">
        <div className="p-6 border-b border-[#474746]">
          <h2 className="font-headline font-bold text-lg text-white">Riya's Admin</h2>
          <p className="text-xs text-[#c8c6c5] mt-0.5">Welcome, {adminName}</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-primary text-white font-semibold'
                  : 'text-[#c8c6c5] hover:bg-[#474746] hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#474746] space-y-2">
          <Link to="/" className="flex items-center gap-3 px-2 py-2 text-xs text-[#c8c6c5] hover:text-white transition-colors">
            <HomeIcon /> View Website
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-2 py-2 text-xs text-[#c8c6c5] hover:text-white transition-colors w-full">
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-8 py-4">
          <h1 className="font-headline font-semibold text-2xl text-on-surface">{title}</h1>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
