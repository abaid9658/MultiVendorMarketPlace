require('dotenv').config({ override: true });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activityRoutes = require('./routes/activityRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const autoSeed = async () => {
  try {
    const User = require('./models/User');
    const Settings = require('./models/Settings');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 No users found in database. Running auto-seeder...');
      await User.create({
        name: 'Alex Sterling',
        email: 'admin@vendorpro.com',
        password: 'admin123',
        role: 'admin',
      });
      await User.create({
        name: 'John Doe',
        email: 'user@vendorpro.com',
        password: 'user123',
        role: 'user',
      });
      await Settings.create({
        organizationName: 'VendorPro Systems Ltd',
        contactEmail: 'support@vendorpro.com',
        contactNumber: '+1 (555) 019-2834',
        address: '100 Innovation Way, Suite 400, Tech City, TC 94016',
        currency: 'USD',
        taxRate: 5,
        enableEmailNotifications: true,
      });
      console.log('🌱 Auto-seeding completed successfully!');
    }
  } catch (err) {
    console.error('❌ Auto-seeding error:', err);
  }
};

// Connect to MongoDB
connectDB().then(() => {
  autoSeed();
});

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';
const allowedOrigins = [clientUrl, `${clientUrl}/`];

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Make io available to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'VendorPro API is running', timestamp: new Date().toISOString() });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to VendorPro API Backend' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5001;
server.listen(PORT, () => {
  console.log(`🚀 VendorPro Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI}`);
});
