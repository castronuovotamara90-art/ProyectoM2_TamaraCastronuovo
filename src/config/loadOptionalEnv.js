const fs = require('node:fs');
const path = require('node:path');
const { loadEnvFile } = require('node:process');

function loadOptionalEnv(filename = '.env') {
  const envPath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(envPath)) {
    return;
  }

  try {
    loadEnvFile(envPath);
  } catch (error) {
    console.warn(`No se pudo cargar ${filename}: ${error.message}`);
  }
}

module.exports = loadOptionalEnv;