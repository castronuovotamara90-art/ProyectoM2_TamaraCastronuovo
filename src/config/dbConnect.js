const { Pool } = require('pg');
const envs = require('./envs');

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function usesRailwayPublicProxy(value) {
  return typeof value === 'string' && value.includes('.proxy.rlwy.net');
}

function usesRailwayPrivateHost(value) {
  return typeof value === 'string' && value.includes('.railway.internal');
}

function getSslConfig(connectionTarget) {
  // Respect explicit DB_SSL when provided by the environment.
  if (hasValue(process.env.DB_SSL)) {
    return envs.DB_SSL ? { rejectUnauthorized: false } : false;
  }

  // Railway public TCP proxy requires TLS.
  if (usesRailwayPublicProxy(connectionTarget)) {
    return { rejectUnauthorized: false };
  }

  // Railway private network host usually works without TLS.
  if (usesRailwayPrivateHost(connectionTarget)) {
    return false;
  }

  // Safe default for managed providers in production.
  return envs.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
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

const hasDatabaseUrl = hasValue(envs.DATABASE_URL);
const hasDiscreteConfig =
  hasValue(envs.DB_HOST) &&
  hasValue(envs.DB_PORT) &&
  hasValue(envs.DB_NAME) &&
  hasValue(envs.DB_USER) &&
  hasValue(envs.DB_PASSWORD);

const dbConnectionProduction = hasDatabaseUrl
  ? {
      connectionString: envs.DATABASE_URL,
      ssl: getSslConfig(envs.DATABASE_URL),
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
      ssl: getSslConfig(envs.DB_HOST),
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    };

if (envs.NODE_ENV === 'production' && !hasDatabaseUrl && !hasDiscreteConfig) {
  throw new Error('No hay configuracion de base de datos valida para produccion.');
}

const pool = new Pool(envs.NODE_ENV === 'production' ? dbConnectionProduction : dbConnectionLocal);

module.exports = pool;
