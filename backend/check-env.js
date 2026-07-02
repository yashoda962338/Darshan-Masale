// check-env.js - Verify environment variables
const dotenv = require('dotenv');
dotenv.config();

console.log('🔍 Checking Environment Configuration...');
console.log('=========================================');
console.log(`📂 Current Directory: ${process.cwd()}`);

const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  console.log('✅ DATABASE_URL is set');
  // Mask password for security
  const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
  console.log(`📊 Connection String: ${maskedUrl}`);
  
  // Parse the URL to check components
  try {
    const url = new URL(databaseUrl);
    console.log(`🔗 Host: ${url.hostname}`);
    console.log(`🔌 Port: ${url.port || '5432'}`);
    console.log(`📁 Database: ${url.pathname.replace('/', '')}`);
    console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
  } catch (e) {
    console.log('⚠️ Could not parse DATABASE_URL format');
  }
} else {
  console.log('❌ DATABASE_URL is NOT set!');
  console.log('Please set DATABASE_URL in your .env file');
}

console.log(`\n⚙️ NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`🚪 PORT: ${process.env.PORT || '5000'}`);
console.log('=========================================');

// Check if .env file exists
const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file NOT found!');
}