const mysql = require('mysql2/promise');

async function getDb() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'kohee_shop'
  });
  return conn;
}

module.exports = { getDb };
