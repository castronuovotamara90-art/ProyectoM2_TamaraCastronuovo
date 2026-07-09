const loadOptionalEnv = require('./loadOptionalEnv');

if (process.env.NODE_ENV !== 'production') {
	loadOptionalEnv('.env');
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT) || 3000;

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT) || 5432;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;

const DB_MAX_CONNECT = Number(process.env.DB_MAX_CONNECT) || 20;
const DB_IDLETIMEOUT = Number(process.env.DB_IDLETIMEOUT) || 30000;
const DB_CONNECTIONTIMEOUT = Number(process.env.DB_CONNECTIONTIMEOUT) || 2000;

// Railway suele requerir SSL en produccion para conexiones administradas.
const DB_SSL = process.env.DB_SSL === 'true' || NODE_ENV === 'production';

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
