const { Pool } = require('pg');
const envs = require('./envs');

function getSslConfig() {
  // Tri-state behavior:
  // - true: force SSL with relaxed cert validation
  // - false: force no SSL
  // - undefined: do not set ssl option; let pg/connection string decide
  if (envs.DB_SSL === undefined) {
    return undefined;
  }

  return envs.DB_SSL ? { rejectUnauthorized: false } : false;
}

function withOptionalSsl(config) {
  const ssl = getSslConfig();
  if (ssl === undefined) {
    return config;
  }

  return { ...config, ssl };
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
  ? withOptionalSsl({
      connectionString: envs.DATABASE_URL,
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    })
  : withOptionalSsl({
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      database: envs.DB_NAME,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    });

if (envs.NODE_ENV === 'production' && !hasDatabaseUrl && !hasDiscreteConfig) {
  throw new Error('No hay configuracion de base de datos valida para produccion.');
}

const pool = new Pool(envs.NODE_ENV === 'production' ? dbConnectionProduction : dbConnectionLocal);

module.exports = pool;
