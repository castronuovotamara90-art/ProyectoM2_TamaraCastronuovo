// Test directo de conexión a PostgreSQL
const { Pool } = require('pg');

console.log('Intentando conectar a PostgreSQL...\n');

const pool = new Pool({
  host: 'postgres.railway.internal',
  port: 5432,
  database: 'railway',
  user: 'postgres',
  password: process.env.PGPASSWORD,
  ssl: false,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Error del pool:', err);
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('❌ Error de conexión:', err.message);
    console.error('Código:', err.code);
    console.error('Detalles completos:', err);
    process.exit(1);
  }

  console.log('✅ Conexión exitosa!');
  
  try {
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query exitosa!');
    console.log('Hora del servidor:', result.rows[0].now);
  } catch (queryErr) {
    console.error('❌ Error en query:', queryErr.message);
  } finally {
    release();
    pool.end();
  }
});
