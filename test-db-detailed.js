// Test detallado de conexión a PostgreSQL
const { Pool, Client } = require('pg');

console.log('=== DEBUG: Conexión a PostgreSQL ===\n');
console.log('Host:', process.env.PGHOST);
console.log('Port:', process.env.PGPORT);
console.log('Database:', process.env.PGDATABASE);
console.log('User:', process.env.PGUSER);
console.log('Password exists:', !!process.env.PGPASSWORD);
console.log('Password length:', process.env.PGPASSWORD?.length);
console.log('');

const config = {
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: false,
  connectionTimeoutMillis: 10000,
};

console.log('Config:', {
  ...config,
  password: config.password ? '***' : 'undefined'
});
console.log('');

const client = new Client(config);

client.on('error', (err) => {
  console.error('❌ Error del cliente:', err.message);
  console.error('Código:', err.code);
  console.error('Severity:', err.severity);
  process.exit(1);
});

client.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:');
    console.error('Mensaje:', err.message);
    console.error('Código:', err.code);
    console.error('Severity:', err.severity);
    console.error('\nDetalles completos:', err);
    process.exit(1);
  }

  console.log('✅ Conexión exitosa!');
  
  client.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('❌ Error en query:', err.message);
      client.end();
      process.exit(1);
    }

    console.log('✅ Query ejecutada exitosamente!');
    console.log('Hora del servidor:', result.rows[0].now);
    
    client.end(() => {
      console.log('Conexión cerrada.');
    });
  });
});
