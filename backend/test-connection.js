// test-connection.js - Database Connection Test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔄 Testing database connection...');
  console.log('📡 Connecting to Neon PostgreSQL...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to Neon database!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version() as version, now() as current_time`;
    console.log('📊 Database Version:', result[0].version);
    console.log('🕐 Server Time:', result[0].current_time);
    
    // Count tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log(`📋 Found ${tables.length} tables in the database:`);
    console.log(tables.map(t => `  - ${t.table_name}`).join('\n'));
    
    console.log('\n✅ Database connection test PASSED!');
    console.log('🚀 You can now run migrations.');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error Message:', error.message);
    
    if (error.message.includes('P1001')) {
      console.log('\n🔍 Troubleshooting Steps:');
      console.log('1. Check your internet connection');
      console.log('2. Verify your DATABASE_URL in .env file');
      console.log('3. Go to Neon Console and get a fresh connection string');
      console.log('4. Try using the pooled connection URL');
      console.log('5. Check if your Neon project is active');
    }
    
    if (error.message.includes('password')) {
      console.log('\n🔑 Password Issue:');
      console.log('1. Your database password might be incorrect');
      console.log('2. Reset password in Neon Console');
      console.log('3. Update .env with new password');
    }
    
    if (error.message.includes('database')) {
      console.log('\n📁 Database Name Issue:');
      console.log('1. Check if the database exists in Neon');
      console.log('2. Create a new database in Neon Console');
      console.log('3. Update .env with correct database name');
    }
    
    console.error('\nFull Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Connection closed.');
  }
}

// Run the test
testConnection();