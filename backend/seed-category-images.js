/**
 * Seed script to add sample images to categories for testing
 * This demonstrates the image system works end-to-end
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./src/models/Category');

// Sample Cloudinary URLs for testing
const categoryImages = {
  'Powder Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000000/darshan-masale/categories/powder-collection.jpg',
    publicId: 'darshan-masale/categories/powder-collection'
  },
  'Premium Masala Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000001/darshan-masale/categories/premium-masala.jpg',
    publicId: 'darshan-masale/categories/premium-masala'
  },
  'Papad Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000002/darshan-masale/categories/papad-collection.jpg',
    publicId: 'darshan-masale/categories/papad-collection'
  },
  'Wadi Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000003/darshan-masale/categories/wadi-collection.jpg',
    publicId: 'darshan-masale/categories/wadi-collection'
  },
  'Pickle Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000004/darshan-masale/categories/pickle-collection.jpg',
    publicId: 'darshan-masale/categories/pickle-collection'
  },
  'Snacks Collection': {
    url: 'https://res.cloudinary.com/dp5hjjv4k/image/upload/v1700000005/darshan-masale/categories/snacks-collection.jpg',
    publicId: 'darshan-masale/categories/snacks-collection'
  }
};

async function seedCategoryImages() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshan-masale';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    let updated = 0;
    for (const [categoryName, imageData] of Object.entries(categoryImages)) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        category.image = imageData;
        await category.save();
        updated++;
        console.log(`✅ Updated ${categoryName} with image`);
      } else {
        console.log(`⚠️  Category "${categoryName}" not found`);
      }
    }

    console.log(`\n✅ Seeded ${updated} categories with images`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding images:', error);
    process.exit(1);
  }
}

seedCategoryImages();
