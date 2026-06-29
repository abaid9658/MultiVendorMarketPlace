# VendorPro — Enterprise Vendor Management & Quotation System

> **Task ID: FS-2** | Full-Stack Web Development Internship Project | Teyzix Core (June 2026 Batch)

A production-ready web application for managing vendors, creating quotation requests, comparing bids, and tracking procurement workflows — built with React, Node.js, Express, MongoDB, and Socket.io.

---

## 🚀 Live Demo

| Service | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | *Deploy using steps below* |
https://multi-vendor-market-place.vercel.app/
| **Backend API** | Render | *Deploy using steps below* | 
https://vendorpro-backend-qaf2.onrender.com
| **Database** | MongoDB Atlas | Connected ✅ |

---

## ✨ Features

### 📋 Vendor Management
- Add, edit, delete and search vendors
- Status tracking: Active / Inactive / Under Review
- Paginated vendor directory table

### 📄 Quotation (RFQ) System
- Create, update and manage RFQ requests
- Assign quotations to specific vendors
- Status workflow: Draft → Pending → In Review → Approved / Rejected
- Export individual quotations to PDF

### 📊 Bid Comparison
- Side-by-side quotation comparison across vendors
- Best value highlighting with savings calculation
- Visual ranking (#1, #2, #3…)

### 📈 Dashboard & Analytics
- Real-time KPI stat cards (vendors, quotations, approvals)
- Quotation flow bar chart (last 6 months)
- Priority quotations table
- Live activity feed

### ⚙️ Settings
- Organization profile management
- System-wide configuration (tax rate, currency)
- Email notification toggle
- Dark / Light mode toggle (persisted across sessions)

### 🔐 Authentication
- JWT-based login & registration
- Role-based access (Admin / User)
- Protected routes

### 🌙 Dark Mode
- System-wide dark mode toggle (TopBar button)
- Persisted in `localStorage`
- Full component coverage

### ⚡ Real-time
- Socket.io integration for live updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (frontend), Render (backend) |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
Project2/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Layout, Sidebar, TopBar
│   │   │   ├── vendors/       # VendorModal
│   │   │   └── quotations/    # QuotationModal
│   │   ├── context/           # AuthContext, SocketContext
│   │   ├── pages/             # Dashboard, Vendors, Quotations, Comparison, Settings
│   │   ├── utils/             # api.js (axios), pdf.js
│   │   └── index.css          # Global design system + components
│   ├── tailwind.config.js     # Design tokens (indigo palette)
│   └── vercel.json            # Vercel SPA routing config
└── server/                    # Node.js + Express backend
    ├── config/db.js
    ├── controllers/           # Auth, Vendor, Quotation, Dashboard, Activity, Settings
    ├── middleware/             # auth.js (JWT), activityLogger.js
    ├── models/                # User, Vendor, Quotation, Activity, Settings
    ├── routes/                # All API route files
    ├── seed.js                # Database seeder
    ├── index.js               # Server entry point
    └── render.yaml            # Render deployment config
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/abaid9658/MultiVendorMarketPlace.git
cd MultiVendorMarketPlace
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values (MongoDB URI, JWT secret, etc.)

npm run dev         # Starts server on port 5001
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev         # Starts Vite dev server on port 5173
```

### 4. Seed the Database (optional but recommended)
```bash
cd server
npm run seed
```

This creates:
- **Admin**: `admin@vendorpro.com` / `admin123`
- **User**: `user@vendorpro.com` / `user123`
- 4 sample vendors, 4 quotation records, activity logs, default settings

---

## 🌐 Deployment Guide

### Frontend → Vercel
1. Push code to GitHub (already done)
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `client`, Framework to `Vite`
4. Deploy — done!

### Backend → Render
1. Create new **Web Service** at [dashboard.render.com](https://dashboard.render.com)
2. Connect GitHub repo, set **Root Directory** to `server`
3. Build command: `npm install` | Start command: `node index.js`
4. Add Environment Variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `MONGODB_URI` | *(your MongoDB Atlas URI)* |
| `JWT_SECRET` | *(your secret key)* |
| `CLIENT_URL` | *(your Vercel frontend URL)* |

### CI/CD (GitHub Actions)
Push to `main` → GitHub Actions automatically:
1. Installs dependencies for server & client
2. Builds the frontend
3. (Optional) Triggers Render deploy hook

See [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) for the pipeline config.

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📜 License

MIT — Teyzix Core Internship Project, June 2026 Batch.
