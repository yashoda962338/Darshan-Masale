const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const clearDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/darshan_masale');
    console.log('✅ Connected to MongoDB');
    
    const result = await Product.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} products`);
    
    console.log('✅ All demo data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearDemoData();