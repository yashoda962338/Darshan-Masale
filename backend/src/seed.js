// 🔴 BACKEND: src/seed.js - Adds/updates ONE admin user only.
// Does NOT delete or touch any existing users (customers stay safe).
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

const adminData = {
  firstName: 'Super',
  lastName: 'Admin',
  displayName: 'Darshan Admin',
  email: 'darshankhairnar381@gmail.com',
  phone: '9209510502',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  gender: 'MALE',
  emailVerified: true,
  phoneVerified: true,
  preferredLanguage: 'en',
  timezone: 'Asia/Kolkata'
};

const adminPassword = 'Darshan@2008';

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seed (safe mode — no existing users are deleted)...');
    await connectDB();

    console.log('🔑 Hashing password...');
    const passwordHash = await hashPassword(adminPassword);

    console.log('📦 Creating/updating admin user...');
    // upsert: if a user with this email exists, update it to SUPER_ADMIN
    // with this password; otherwise create it. No other users are touched.
    const admin = await User.findOneAndUpdate(
      { email: adminData.email },
      { ...adminData, passwordHash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('\n✅ Admin seed completed successfully!');
    console.log('========================================');
    console.log(`👤 Name:  ${admin.displayName}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`📱 Phone: ${admin.phone}`);
    console.log(`🛡️  Role:  ${admin.role}`);
    console.log('----------------------------------------');

    console.log('\n🔑 Admin Login Credentials:');
    console.log('========================================');
    console.log(`   Email:    ${adminData.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role:     SUPER_ADMIN`);
    console.log('');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed.');
    process.exit(0);
  }
}

seedAdmin();