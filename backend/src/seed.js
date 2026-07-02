// 🔴 BACKEND: src/seed.js - Updated with proper hashing
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');

dotenv.config();

// Function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const users = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    displayName: 'Darshan Admin',
    email: 'admin@darshanmasale.com',
    phone: '9876543210',
    passwordHash: null, // Will be set after hashing
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    gender: 'MALE',
    emailVerified: true,
    phoneVerified: true,
    preferredLanguage: 'en',
    timezone: 'Asia/Kolkata'
  },
  {
    firstName: 'Test',
    lastName: 'Customer',
    displayName: 'Test Customer',
    email: 'customer@darshanmasale.com',
    phone: '9876543211',
    passwordHash: null,
    role: 'CUSTOMER',
    status: 'ACTIVE',
    gender: 'FEMALE',
    emailVerified: true,
    phoneVerified: true,
    preferredLanguage: 'en',
    timezone: 'Asia/Kolkata'
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    displayName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543212',
    passwordHash: null,
    role: 'CUSTOMER',
    status: 'ACTIVE',
    gender: 'FEMALE',
    emailVerified: true,
    phoneVerified: true,
    preferredLanguage: 'en',
    timezone: 'Asia/Kolkata'
  }
];

async function seedUsers() {
  try {
    console.log('🌱 Starting database seed...');
    await connectDB();
    
    console.log('🗑️ Removing existing users...');
    await User.deleteMany({});
    
    console.log('🔑 Hashing passwords...');
    // Hash passwords for each user
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const password = user.email === 'admin@darshanmasale.com' ? 'admin123' :
                       user.email === 'priya@example.com' ? 'priya123' :
                       'customer123';
      user.passwordHash = await hashPassword(password);
      return user;
    }));
    
    console.log('📦 Creating test users...');
    const createdUsers = await User.insertMany(hashedUsers);
    
    console.log('\n✅ Seed completed successfully!');
    console.log('📊 Created Users:');
    console.log('========================================');
    
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName || user.firstName + ' ' + user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📱 Phone: ${user.phone}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   🔑 Password: ${user.email === 'admin@darshanmasale.com' ? 'admin123' : 
                                     user.email === 'priya@example.com' ? 'priya123' : 
                                     'customer123'}`);
      console.log('----------------------------------------');
    });
    
    console.log('\n🔑 Test Credentials:');
    console.log('========================================');
    console.log('Admin Login:');
    console.log('   Email: admin@darshanmasale.com');
    console.log('   Password: admin123');
    console.log('   Role: SUPER_ADMIN');
    console.log('');
    console.log('Customer Login:');
    console.log('   Email: customer@darshanmasale.com');
    console.log('   Password: customer123');
    console.log('   Role: CUSTOMER');
    console.log('');
    console.log('Customer Login 2:');
    console.log('   Email: priya@example.com');
    console.log('   Password: priya123');
    console.log('   Role: CUSTOMER');
    console.log('========================================');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed.');
    process.exit(0);
  }
}

seedUsers();