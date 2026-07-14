const { Pool } = require('pg');
const envs = require('./envs');

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

const hasDiscreteDbConfig = Boolean(
  envs.DB_HOST && envs.DB_PORT && envs.DB_NAME && envs.DB_USER && envs.DB_PASSWORD
);

const dbConnectionProduction = hasDiscreteDbConfig
  ? {
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      database: envs.DB_NAME,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      ssl: envs.DB_SSL ? { rejectUnauthorized: false } : false,
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    }
  : {
      connectionString: envs.DATABASE_URL,
      ssl: envs.DB_SSL ? { rejectUnauthorized: false } : false,
      max: envs.DB_MAX_CONNECT,
      idleTimeoutMillis: envs.DB_IDLETIMEOUT,
      connectionTimeoutMillis: envs.DB_CONNECTIONTIMEOUT,
    };

const pool = new Pool(envs.NODE_ENV === 'production' ? dbConnectionProduction : dbConnectionLocal);

module.exports = pool;
