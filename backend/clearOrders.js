// backend/clearOrders.js
// One-time script to clear ONLY the orders collection before client handoff.
// Run with: node clearOrders.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

async function clearOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    const countBefore = await ordersCollection.countDocuments();
    console.log(`📦 Found ${countBefore} orders in the database.`);

    if (countBefore === 0) {
      console.log('ℹ️  Nothing to delete. Orders collection is already empty.');
    } else {
      const result = await ordersCollection.deleteMany({});
      console.log(`🗑️  Deleted ${result.deletedCount} orders successfully.`);
    }

    await mongoose.disconnect();
    console.log('✅ Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing orders:', error.message);
    process.exit(1);
  }
}

clearOrders();