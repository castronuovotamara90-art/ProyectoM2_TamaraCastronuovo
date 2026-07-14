const { Pool } = require('pg');
const envs = require('./envs');

function getSslConfig() {
  // Only enable SSL if explicitly requested via DB_SSL environment variable.
  // Automatic SSL detection has caused connection failures on some Railway proxies.
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

const hasDatabaseUrl = envs.DATABASE_URL !== undefined && envs.DATABASE_URL !== '';
const hasDiscreteConfig =
  envs.DB_HOST &&
  envs.DB_PORT &&
  envs.DB_NAME &&
  envs.DB_USER &&
  envs.DB_PASSWORD;

const dbConnectionProduction = hasDatabaseUrl
  ? {
      connectionString: envs.DATABASE_URL,
      ssl: getSslConfig(),
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    }
  : {
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      database: envs.DB_NAME,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      ssl: getSslConfig(),
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    };

if (envs.NODE_ENV === 'production' && !hasDatabaseUrl && !hasDiscreteConfig) {
  throw new Error('No hay configuracion de base de datos valida para produccion.');
}

const pool = new Pool(envs.NODE_ENV === 'production' ? dbConnectionProduction : dbConnectionLocal);

module.exports = pool;
