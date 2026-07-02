// backend/src/app.js - COMPLETE PRODUCTION READY
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require("./routes/reviews");
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settings');
const galleryRoutes = require('./routes/gallery');
const paymentRoutes=require("./routes/paymentRoutes");

dotenv.config();

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Compression - Gzip Response
app.use(compression());

// Morgan - Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// RATE LIMITING
// ============================================

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Rate Limiter (Stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// CORS CONFIGURATION
// ============================================

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://darshanmasale.com',
  'https://www.darshanmasale.com',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400, // 24 hours
}));

// ============================================
// DATABASE CONNECTION
// ============================================

if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('⚠️ MONGODB_URI not found. Database will not connect.');
}

// ============================================
// MIDDLEWARE
// ============================================

// Body Parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust Proxy (for production)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ============================================
// API ROUTES - VERIFIED
// ============================================

console.log('📦 Registering routes...');

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use("/api/payments",paymentRoutes);

// User Routes (Protected)
app.use('/api/users', userRoutes);

// Protected Routes (Auth required) - ✅ VERIFIED
console.log('🛒 Registering cart routes at /api/cart');
app.use('/api/cart', cartRoutes);
console.log('✅ Cart routes registered at /api/cart');

app.use('/api/orders', orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

console.log('✅ All routes registered:');
console.log('  - /api/auth');
console.log('  - /api/products');
console.log('  - /api/categories');
console.log('  - /api/gallery');
console.log('  - /api/users');
console.log('  - /api/cart');
console.log('  - /api/orders');
console.log('  - /api/wishlist');
console.log('  - /api/admin');
console.log('  - /api/settings');

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 
                   mongoose.connection.readyState === 2 ? 'Connecting' : 
                   mongoose.connection.readyState === 3 ? 'Disconnecting' : 'Disconnected';
  
  res.json({
    success: true,
    message: 'Server is running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
  });
});

// ============================================
// ROOT ROUTE
// ============================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Darshan Masale API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verifyOTP: 'POST /api/auth/verify-registration-otp',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password',
        profile: 'GET /api/auth/profile',
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        changePassword: 'PUT /api/users/change-password',
        addresses: 'GET /api/users/addresses',
        addAddress: 'POST /api/users/addresses',
        updateAddress: 'PUT /api/users/addresses/:id',
        deleteAddress: 'DELETE /api/users/addresses/:id',
      },
      gallery: {
        list: 'GET /api/gallery',
        single: 'GET /api/gallery/:id',
      },
      products: {
        list: 'GET /api/products',
        featured: 'GET /api/products/featured',
        bestsellers: 'GET /api/products/bestsellers',
        single: 'GET /api/products/:id',
        search: 'GET /api/products/search',
        category: 'GET /api/products/category/:category',
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart',
        update: 'PUT /api/cart/:itemId',
        remove: 'DELETE /api/cart/:itemId',
        clear: 'DELETE /api/cart',
      },
      orders: {
        list: 'GET /api/orders',
        create: 'POST /api/orders',
        details: 'GET /api/orders/:id',
      },
      wishlist: {
        get: 'GET /api/wishlist',
        add: 'POST /api/wishlist',
        remove: 'DELETE /api/wishlist/:id',
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard',
        products: 'GET /api/admin/products',
        orders: 'GET /api/admin/orders',
        customers: 'GET /api/admin/customers',
        users: 'GET /api/admin/users',
        analytics: 'GET /api/admin/analytics',
        gallery: 'GET /api/admin/gallery',
      },
    },
    documentation: 'https://github.com/darshan-masale/backend',
    status: 'running'
  });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please login again.',
    });
  }

  // Default Error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// UNHANDLED REJECTION HANDLER
// ============================================

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Graceful shutdown
  // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Graceful shutdown
  // server.close(() => process.exit(1));
});

module.exports = app;