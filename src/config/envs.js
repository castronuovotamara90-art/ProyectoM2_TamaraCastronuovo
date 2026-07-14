const loadOptionalEnv = require('./loadOptionalEnv');

if (process.env.NODE_ENV !== 'production') {
	loadOptionalEnv('.env');
}

function firstDefined(...values) {
	return values.find((value) => value !== undefined && value !== '');
}

function toNumber(value, fallback) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback = false) {
	if (value === undefined || value === '') return fallback;
	if (typeof value === 'boolean') return value;
	const normalized = String(value).trim().toLowerCase();
	return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = toNumber(process.env.PORT, 3000);

const DB_HOST = firstDefined(process.env.DB_HOST, process.env.PGHOST, process.env.POSTGRES_HOST);
const DB_PORT = toNumber(
	firstDefined(process.env.DB_PORT, process.env.PGPORT, process.env.POSTGRES_PORT),
	5432
);
const DB_NAME = firstDefined(process.env.DB_NAME, process.env.PGDATABASE, process.env.POSTGRES_DB);
const DB_USER = firstDefined(process.env.DB_USER, process.env.PGUSER, process.env.POSTGRES_USER);
const DB_PASSWORD = firstDefined(
	process.env.DB_PASSWORD,
	process.env.PGPASSWORD,
	process.env.POSTGRES_PASSWORD
);
const DATABASE_URL = firstDefined(
	process.env.DATABASE_PUBLIC_URL,
	process.env.DATABASE_URL,
	process.env.POSTGRES_URL,
	process.env.DATABASE_PRIVATE_URL
);

const DB_MAX_CONNECT = toNumber(process.env.DB_MAX_CONNECT, 20);
const DB_IDLETIMEOUT = toNumber(process.env.DB_IDLETIMEOUT, 30000);
const DB_CONNECTIONTIMEOUT = toNumber(process.env.DB_CONNECTIONTIMEOUT, 2000);

// En produccion habilitamos SSL por defecto para evitar cortes de handshake
// en proveedores gestionados como Railway.
const DB_SSL = toBoolean(process.env.DB_SSL, NODE_ENV === 'production');

function validateDbConfig() {
	if (NODE_ENV !== 'production') {
		return;
	}

	if (DATABASE_URL) {
		return;
	}

	const required = {
		DB_HOST,
		DB_NAME,
		DB_USER,
		DB_PASSWORD,
	};

	const missing = Object.entries(required)
		.filter(([, value]) => !value)
		.map(([key]) => key);

	if (missing.length > 0) {
		throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
	}
}

validateDbConfig();

module.exports = {
	NODE_ENV,
	PORT,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	DATABASE_URL,
	DB_SSL,
	DB_MAX_CONNECT,
	DB_IDLETIMEOUT,
	DB_CONNECTIONTIMEOUT,
};
