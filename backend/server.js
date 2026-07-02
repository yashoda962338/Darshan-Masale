// backend/server.js - CORRECTED
const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Start server with proper logging
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API URL: http://localhost:${PORT}/api`);
  console.log(`🛒 Cart endpoint: http://localhost:${PORT}/api/cart`);
  console.log(`🔗 Products endpoint: http://localhost:${PORT}/api/products`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.log(`💡 Try killing the process on port ${PORT}:`);
    console.log(`   On Mac/Linux: lsof -i :${PORT} && kill -9 <PID>`);
    console.log(`   On Windows: netstat -ano | findstr :${PORT} && taskkill /PID <PID> /F`);
    process.exit(1);
  }
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  gracefulShutdown();
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown();
});










// // backend/server.js
// const app = require('./src/app');
// const dotenv = require('dotenv');
// dotenv.config();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 API URL: http://localhost:${PORT}/api/products`);
//   console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
// }).on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
//     process.exit(1);
//   }
// });