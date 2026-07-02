// test-pg.js - Test using native PostgreSQL driver
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function testPgConnection() {
  console.log('🔄 Testing native PostgreSQL connection...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected using native pg driver!');
    
    const res = await client.query('SELECT version() as version, now() as current_time');
    console.log('📊 Database Version:', res.rows[0].version);
    console.log('🕐 Server Time:', res.rows[0].current_time);
    
    await client.end();
    console.log('✅ Connection test PASSED!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testPgConnection();