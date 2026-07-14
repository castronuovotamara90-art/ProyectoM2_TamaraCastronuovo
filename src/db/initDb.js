const fs = require('node:fs/promises');
const path = require('node:path');
const loadOptionalEnv = require('../config/loadOptionalEnv');

if (process.env.NODE_ENV !== 'production') {
  loadOptionalEnv('.env');
}
const pool = require('../config/dbConnect');

async function initDb() {
  try {
    const sqlPath = path.join(__dirname, 'setup.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    await pool.query(sql);
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
    if (error.code) console.error('Codigo:', error.code);
    if (error.severity) console.error('Severity:', error.severity);
    if (error.address) console.error('Address:', error.address);
    if (error.port) console.error('Port:', error.port);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.hint) console.error('Hint:', error.hint);
    if (error.stack) console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();
