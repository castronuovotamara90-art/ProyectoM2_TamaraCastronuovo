const { Pool } = require('pg');
const envs = require('./envs');

function getSslConfig() {
  // Railway public TCP proxy requires TLS; without it the server closes
  // the connection during handshake with "Connection terminated unexpectedly".
  if (typeof envs.DATABASE_URL === 'string' && envs.DATABASE_URL.includes('.proxy.rlwy.net')) {
    return { rejectUnauthorized: false };
  }

  return envs.DB_SSL ? { rejectUnauthorized: false } : false;
}

const dbConnectionLocal = {
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  database: envs.DB_NAME,
  user: envs.DB_USER,
  password: envs.DB_PASSWORD,
  max: envs.DB_MAX_CONNECT,
  idleTimeoutMillis: envs.DB_IDLETIMEOUT,
  connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
};

const dbConnectionProduction = {
  connectionString: envs.DATABASE_URL,
  ssl: getSslConfig(),
  max: envs.DB_MAX_CONNECT,
  idleTimeoutMillis: envs.DB_IDLETIMEOUT,
  connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
};

const pool = new Pool(envs.NODE_ENV === 'production' ? dbConnectionProduction : dbConnectionLocal);

module.exports = pool;
