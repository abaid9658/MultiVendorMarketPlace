# VendorPro - Vendor Management & Quotation System
### Task ID: FS-2 | Full-Stack Web Development | TEYZEX CORE Internship

A web-based **Vendor Management & Quotation System** designed for procurement departments and enterprise organizations to efficiently manage vendor profiles, automate requests for quotations (RFQs), receive pricing proposals, and compare submissions side-by-side.

---

## 🚀 Key Features

* **Vendor Management**: Complete CRUD operations for vendor profiles (Name, Company, Contact, Address, Status, Notes).
* **Quotation Management**: RFQ builder with title, description, assigned vendor, submission date, expiration date, and amount.
* **Live Dashboard Metrics**: Dynamic counters for Total Vendors, Active RFQs, Pending Bids, and Approved Proposals.
* **Real-time Activity Logging**: User actions (creating/updating vendors, changing RFQ statuses) are logged and broadcasted instantly using WebSockets (**Socket.io**).
* **Quotation Comparison Tool**: Side-by-side bidding analysis. Color-coded markers highlight the **most cost-effective (cheapest) proposal** and calculate savings.
* **PDF Export**: Instant invoice-style PDF generation for quotations using **jsPDF**.
* **Branded Interface (Tailwind CSS)**: Fully matching the modern material-inspired Stitch design system, with fluid micro-interactions and dark mode support.
* **Secure Authorization**: Token-based authentication (**JWT**) with password hashing using **bcryptjs**.

---

## 🛠️ Tech Stack & System Design

* **Frontend**: React (Vite), Tailwind CSS, React Router v6, Axios, Socket.io-client, jsPDF
* **Backend**: Node.js, Express.js, Socket.io, Mongoose
* **Database**: MongoDB Atlas (Cloud)
* **Architecture**: Model-View-Controller (MVC) API layer with real-time websocket event emitter.

---

## 📂 Project Structure

```
Project2/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # Layout (Sidebar, TopBar) & Modals
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── pages/              # Dashboard, Vendors, Quotations, Comparison, Settings, Login
│   │   ├── utils/              # Axios API instance, PDF exporter
│   │   ├── App.jsx             # React Routes & Protection
│   │   └── index.css           # Tailwind + Custom components
│   └── vite.config.js          # Proxy definitions for backend/websockets
│
└── server/                     # Node.js Express Backend
    ├── config/                 # DB Connection
    ├── controllers/            # Controller logic (Auth, Vendor, Quote, Dashboard, Settings)
    ├── middleware/             # Auth guard (JWT verification), Activity Logger
    ├── models/                 # Mongoose schemas (User, Vendor, Quotation, Settings, Activity)
    ├── routes/                 # API Routes
    ├── index.js                # Main Entry Point with Socket.io server
    └── seed.js                 # Automatic DB Seeding Script
```

---

## 🛢️ Database Schema Design

### 1. User (`User.js`)
* `name`: String (Required)
* `email`: String (Unique, Lowercase, Required)
* `password`: String (Hashed, Required)
* `role`: String ('admin' | 'user')

### 2. Vendor (`Vendor.js`)
* `vendorName`: String (Required)
* `companyName`: String (Required)
* `email`: String (Unique, Required)
* `contactNumber`: String (Required)
* `businessAddress`: String (Required)
* `status`: String ('active' | 'inactive')
* `notes`: String

### 3. Quotation (`Quotation.js`)
* `rfqId`: String (Unique, Auto-generated e.g., `RFQ-2026-001`)
* `title`: String (Required)
* `description`: String (Required)
* `vendor`: ObjectId (Ref: Vendor, Required)
* `amount`: Number (Required)
* `submissionDate`: Date (Required)
* `expirationDate`: Date
* `status`: String ('draft' | 'pending' | 'active' | 'in_review' | 'approved' | 'rejected')
* `notes`: String
* `createdBy`: ObjectId (Ref: User)

---

## ⚙️ How to Setup & Run

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* MongoDB Atlas account (or local MongoDB running)

### 1. Configure Environment Variables
Inside `server/`, create a `.env` file based on `.env.example`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Install Dependencies & Seed Database
Open terminal/cmd and run:

**For Backend:**
```bash
cd server
npm install
npm run seed     # Seeds default users, vendors, and quotation records
npm run dev      # Starts server on http://localhost:5000
```

**For Frontend:**
```bash
cd client
npm install
npm run dev      # Starts frontend on http://localhost:5173
```

---

## 🔐 Credentials for Testing

After running `npm run seed`, you can log in with:

* **Email**: `admin@vendorpro.com`
* **Password**: `admin123`

---

## 📦 Deployment Configuration
* **Vercel** (`client/vercel.json`) is set up for hosting the frontend application.
* **Render** configurations are pre-defined for host execution.
