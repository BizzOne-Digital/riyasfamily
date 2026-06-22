# Riya's Family Dining — Full Stack Website

## Project Structure
```
riya-project/
├── frontend/   → React + Vite + Tailwind (deploy to Vercel)
└── backend/    → Node.js + Express + MongoDB (deploy to Vercel)
```

---

## Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env       # Fill in your values
npm run dev                # Runs on http://localhost:5000
```

**Required .env values:**
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `PORT` — 5000 (default)

**Create your first admin account:**
Send a POST request to `http://localhost:5000/api/auth/register`:
```json
{ "name": "Manivannan", "email": "mani15209@gmail.com", "password": "YourPassword123" }
```
*Remove the /register route from auth.js after creating your account.*

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env       # Set VITE_API_URL=http://localhost:5000/api
npm run dev                # Runs on http://localhost:3000
```

---

## Vercel Deployment

### Deploy Backend First:
1. Push `backend/` folder to a GitHub repo (e.g. `riyas-backend`)
2. Go to vercel.com → New Project → Import that repo
3. Add Environment Variables in Vercel dashboard:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
4. Deploy — note your URL e.g. `https://riyas-backend.vercel.app`

### Deploy Frontend:
1. Push `frontend/` folder to GitHub (e.g. `riyas-frontend`)
2. Go to vercel.com → New Project → Import that repo
3. Add Environment Variable:
   - `VITE_API_URL` = `https://riyas-backend.vercel.app/api`
4. Also update `backend/server.js` CORS to allow your frontend Vercel URL
5. Deploy

---

## Pages & Features

### Customer-Facing:
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, categories, about, testimonials |
| Menu | `/menu` | Filterable menu grid |
| Order | `/order` | Full ordering flow with cart |
| Contact | `/contact` | Contact form + info + map |

### Admin Panel (Staff Only):
| Page | URL | Description |
|------|-----|-------------|
| Login | `/admin/login` | Staff authentication |
| Dashboard | `/admin` | Stats + recent orders |
| Orders | `/admin/orders` | All orders + status updates |
| Menu | `/admin/menu` | Add/edit/delete menu items |

---

## API Endpoints

### Public
- `GET /api/health` — Health check
- `GET /api/menu` — All available menu items
- `GET /api/menu?category=Main Courses` — Filtered by category
- `POST /api/orders` — Place an order
- `POST /api/contact` — Send contact message

### Admin (requires Bearer token)
- `POST /api/auth/login` — Login
- `GET /api/menu/all` — All items including unavailable
- `POST /api/menu` — Add item
- `PUT /api/menu/:id` — Update item
- `DELETE /api/menu/:id` — Delete item
- `GET /api/orders` — All orders
- `GET /api/orders?status=Received` — Filtered by status
- `GET /api/orders/stats` — Dashboard stats
- `PUT /api/orders/:id/status` — Update order status

---

## Design
- Theme: Heritage Hearth (warm cream, deep red, amber)
- Fonts: Playfair Display (headlines) + Montserrat (body)
- All icons: SVG (no emoji)
- Fully responsive — mobile, tablet, desktop

---

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs
- **Deploy:** Vercel (both frontend and backend)

---

## Contact Info (Client)
- Restaurant: Riya's Family Dining
- Address: 701 Robert Street East, Swift Current, SK S9H 5G1
- Phone: 306-973-9472 / 306-315-1114
- Email: riyasfamilydining@gmail.com
