const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ai_startup_factory',
  password: 'Projeto C-137',
  port: 5432,
});

module.exports = pool;