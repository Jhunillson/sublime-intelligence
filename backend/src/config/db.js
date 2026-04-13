const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  database: process.env.PGDATABASE || process.env.DB_NAME || 'sublime_intelligence',
  user: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
  ssl: process.env.PGHOST ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
