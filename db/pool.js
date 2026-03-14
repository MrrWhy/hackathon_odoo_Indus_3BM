// db/pool.js — PostgreSQL connection pool
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'netstock',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.error('   Check your .env file DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

module.exports = pool;
