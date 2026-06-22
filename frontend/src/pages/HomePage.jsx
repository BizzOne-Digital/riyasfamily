import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

// SVG Icons
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary fill-secondary" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-5 8z"/>
  </svg>
)
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
)
const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 7H8V5h8v2zm2.5 2H18V9h-.5c-1.93 0-3.5-1.57-3.5-3.5 0-.17.02-.34.04-.5H16v3h-.73c.71 0 1.23-.04 1.73-.17V8c0 .55.45 1 1 1h1.05C19.9 9 20.5 8.47 20.5 8V6.65C21.39 7.07 22 7.97 22 9c0 1.93-1.57 3-3.5 3zM10.5 21h3v-2h-3v2zM5 21h3v-2H5v2z"/>
  </svg>
)
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm2-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z"/>
  </svg>
)
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/>
  </svg>
)

const categories = [
  {
    name: 'Appetizers',
    img: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80',
  },
  {
    name: 'Main Courses',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  },
  {
    name: 'Family Meals',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
  },
  {
    name: 'Desserts',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
  },
  {
    name: 'Beverages',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  },
]

const testimonials = [
  { name: 'Sarah M.', text: 'Best family restaurant in Swift Current. The food is always fresh and the staff is so friendly!', stars: 5 },
  { name: 'James T.', text: 'We ordered delivery for the whole family. Arrived hot and on time. Highly recommend the family meals!', stars: 5 },
  { name: 'Lisa R.', text: 'Authentic flavors, great portions. Our go-to for dine-in every weekend.', stars: 5 },
]

export default function HomePage() {
  const [popularItems, setPopularItems] = useState([])

  useEffect(() => {
    api.get('/menu').then(res => {
      setPopularItems(res.data.filter(i => i.isPopular).slice(0, 4))
    }).catch(() => {})
  }, [])

  return (
    <main className="pt-16">
      {/* Hero */}
      <section
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-6 max-w-3xl fade-in">
          <p className="text-white/80 text-sm font-body font-semibold uppercase tracking-widest mb-3">Swift Current, Saskatchewan</p>
          <h1 className="text-white font-headline font-bold text-4xl md:text-6xl leading-tight mb-4">
            Fresh Food,<br/>Family Atmosphere
          </h1>
          <p className="text-white/90 font-body text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Authentic flavors served with warmth. Dine-in, takeout, or order online — we bring the restaurant to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="btn-primary text-base px-8 py-4">Order Online</Link>
            <Link to="/menu" className="bg-white/15 backdrop-blur border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-white hover:text-primary transition-all">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-surface-container-low py-12 px-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <TableIcon />, title: 'Dine-In', desc: 'Enjoy a relaxed family atmosphere at our restaurant.' },
            { icon: <BagIcon />, title: 'Takeout', desc: 'Order ahead, pick up hot and fresh at your convenience.' },
            { icon: <TruckIcon />, title: 'Delivery', desc: 'We deliver right to your door. Order online now.' },
          ].map(s => (
            <div key={s.title} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-primary mb-3 flex justify-center">{s.icon}</div>
              <h3 className="font-headline font-semibold text-xl mb-2 text-on-surface">{s.title}</h3>
              <p className="text-sm text-on-surface-variant">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 px-6 max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-headline font-semibold text-3xl text-primary mb-2">Explore Our Menu</h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/menu?category=${cat.name}`}
              className="relative h-52 rounded-lg overflow-hidden group shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white font-headline font-semibold text-base">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" className="btn-outline">See Full Menu</Link>
        </div>
      </section>

      {/* Popular Items (if any from API) */}
      {popularItems.length > 0 && (
        <section className="bg-surface-container-low py-16 px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="font-headline font-semibold text-3xl text-center text-primary mb-2">Popular Dishes</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map(item => (
                <div key={item._id} className="card">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-headline font-semibold text-base mb-1">{item.name}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-lg">${item.price.toFixed(2)}</span>
                      <Link to="/order" className="text-xs btn-primary px-3 py-1.5">Order</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="py-16 px-6 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80"
            alt="Restaurant interior"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 text-secondary mb-3">
            <LeafIcon />
            <span className="text-sm font-semibold uppercase tracking-wide">Our Story</span>
          </div>
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-4">
            A Family Tradition Since Day One
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            Riya's Family Dining was built on the belief that great food brings people together. We offer a full-service dining experience with authentic recipes, quality ingredients, and a welcoming atmosphere for families of all sizes.
          </p>
          <p className="text-on-surface-variant text-base leading-relaxed mb-6">
            Whether you're joining us for a sit-down meal, grabbing takeout, or ordering delivery — every dish is made fresh with care.
          </p>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1"><ClockIcon /> Mon–Sun: 11am – 9pm</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-headline font-bold text-3xl text-white text-center mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex gap-1 mb-3">{Array(t.stars).fill(0).map((_, j) => <StarIcon key={j} />)}</div>
                <p className="text-on-surface-variant text-sm italic mb-4">"{t.text}"</p>
                <p className="font-semibold text-on-surface text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center max-w-screen-xl mx-auto">
        <h2 className="font-headline font-bold text-3xl mb-4 text-on-surface">Ready to Order?</h2>
        <p className="text-on-surface-variant mb-8">Browse our menu and place your order for dine-in, takeout, or delivery.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/order" className="btn-primary px-10 py-4 text-base">Order Online Now</Link>
          <Link to="/contact" className="btn-outline px-10 py-4 text-base">Contact Us</Link>
        </div>
      </section>
    </main>
  )
}
