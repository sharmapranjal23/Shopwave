# ShopWave — Premium Ecommerce Platform

A full-stack ecommerce platform built with **React + Vite** (frontend) and **Node.js + Express + SQLite** (backend).

## 🚀 Quick Start

Double-click **`START.bat`** to launch both servers, then open:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5001

### Manual Start
```bash
# Terminal 1 — Backend
cd frontend
node server/index.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

## 🔑 Demo Credentials
| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@shopwave.com     | admin123   |

## 🛍️ Features

### Customer Features
- 🏠 **Homepage** — Hero banner, categories, featured & trending products
- 🔍 **Search** — Live suggestions + full search
- 📦 **Product Pages** — Detailed view, reviews, ratings
- 🛒 **Shopping Cart** — Qty controls, order summary
- ❤️ **Wishlist** — Save products you love
- 💳 **Checkout** — Multi-step: address → payment → confirmation
- 📋 **Orders** — Order history with status tracking
- 👤 **Profile** — Account management

### Platform Features
- 🔐 **JWT Authentication** — Secure login/register
- 📱 **Responsive Design** — Works on all devices
- 🌙 **Dark Mode** — Premium glassmorphic UI
- ⭐ **Reviews System** — Rate and review products
- 💰 **Price Filtering** — Sort by price, rating, newest
- 🏷️ **Categories** — Electronics, Fashion, Home, Sports, Beauty, Books

## 🗂️ Project Structure
```
Project_3/
├── START.bat              # One-click launcher
├── frontend/
│   ├── server/            # Express backend
│   │   └── index.js       # API routes + SQLite DB
│   ├── src/
│   │   ├── components/    # Navbar, Footer, ProductCard
│   │   ├── pages/         # Home, Products, Cart, etc.
│   │   ├── contexts.jsx   # Auth, Cart, Wishlist state
│   │   ├── App.jsx        # Router setup
│   │   └── index.css      # Global styles
│   └── package.json
```

## 🎨 Tech Stack
- **Frontend:** React 19 + Vite 8 + React Router 7
- **Backend:** Node.js + Express 5
- **Database:** SQLite (better-sqlite3) — zero config
- **Auth:** JWT + bcryptjs
- **Styling:** Pure CSS (glassmorphism + dark mode)
- **Icons:** Lucide React
- **Notifications:** react-hot-toast
