const { loadEnvFile } = require('node:process');
const fs = require('node:fs/promises');
const path = require('node:path');

loadEnvFile('.env');
const pool = require('../config/dbConnect');

async function initDb() {
  try {
    const sqlPath = path.join(__dirname, 'setup.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    await pool.query(sql);
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();
