const { loadEnvFile } = require('node:process');

loadEnvFile('.env');
const app = require('./server');
const pool = require('./config/dbConnect');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} recibido, cerrando servidor...`);

  server.close(async () => {
    try {
      console.log('Servidor HTTP cerrado, cerrando pool...');
      await pool.end();
      console.log('Pool cerrado, saliendo');
      process.exit(0);
    } catch (error) {
      console.error('Error cerrando pool:', error.message);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});
