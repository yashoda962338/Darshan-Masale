// src/config/database/prisma.js - Prisma Client Configuration
const { PrismaClient } = require('@prisma/client');

// Extend Prisma Client with custom methods
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
    errorFormat: 'pretty',
  });
};

// Prevent multiple instances in development
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Add middleware for soft delete
prisma.$use(async (params, next) => {
  // Check if model has deletedAt field
  const modelsWithSoftDelete = [
    'User', 'Category', 'Product', 'Address', 
    'Order', 'Review', 'Coupon', 'Gallery',
    'HeroBanner', 'PaymentMethodUser'
  ];
  
  if (modelsWithSoftDelete.includes(params.model)) {
    if (params.action === 'findMany' || 
        params.action === 'findUnique' ||
        params.action === 'findFirst') {
      // Add deletedAt null filter
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }
  }
  
  return next(params);
});

// Add query logging in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('📊 Query:', e.query);
    console.log('⏱️  Duration:', e.duration + 'ms');
  });
}

module.exports = prisma;