const { argv } = require('node:process');
const loadOptionalEnv = require('../config/loadOptionalEnv');

loadOptionalEnv('.env');
const pool = require('../config/dbConnect');

const testAuthorEmailConditions = [
  "email LIKE 'test.author.%@example.com'",
  "email LIKE 'author.post.%@example.com'",
  "email LIKE 'author.string.id.%@example.com'",
  "email LIKE 'author.extra.field.%@example.com'",
  "email LIKE 'author.update.%@example.com'",
  "email LIKE 'author.update.post.%@example.com'",
  "email LIKE 'author.delete.%@example.com'",
  "email LIKE 'author.delete.post.%@example.com'",
  "email LIKE 'duplicado.%@example.com'",
].join(' OR ');

const testPostTitleConditions = [
  "title LIKE 'Post de prueba %'",
  "title LIKE 'Post con author_id string %'",
  "title LIKE 'Post con campo extra %'",
  "title LIKE 'Post Update %'",
  "title LIKE 'Post Delete %'",
  "title = 'Post invalido author_id'",
  "title = 'Post published invalido'",
].join(' OR ');

const isDryRun = argv.includes('--dry-run');

async function showCounts(client) {
  const postCountResult = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM posts
     WHERE ${testPostTitleConditions}`
  );

  const authorCountResult = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM authors
     WHERE ${testAuthorEmailConditions}`
  );

  const authorsToDelete = authorCountResult.rows[0].count;
  const postsToDeleteByTitle = postCountResult.rows[0].count;

  console.log(`Autores de test detectados: ${authorsToDelete}`);
  console.log(`Posts de test por titulo detectados: ${postsToDeleteByTitle}`);
}

async function cleanTestData() {
  const client = await pool.connect();

  try {
    await showCounts(client);

    if (isDryRun) {
      console.log('Dry run activo: no se eliminaron datos.');
      return;
    }

    await client.query('BEGIN');

    const deletePostsResult = await client.query(
      `DELETE FROM posts
       WHERE ${testPostTitleConditions}`
    );

    const deleteAuthorsResult = await client.query(
      `DELETE FROM authors
       WHERE ${testAuthorEmailConditions}`
    );

    await client.query(
      "SELECT setval('authors_id_seq', COALESCE((SELECT MAX(id) FROM authors), 1), true)"
    );
    await client.query(
      "SELECT setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 1), true)"
    );

    await client.query('COMMIT');

    console.log(`Posts eliminados (match por titulo): ${deletePostsResult.rowCount}`);
    console.log(`Autores eliminados (match por email): ${deleteAuthorsResult.rowCount}`);
    console.log('Secuencias reseteadas correctamente.');
    console.log('Limpieza de datos de test completada.');
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // No-op: el rollback puede fallar si no hubo transaccion activa.
    }
    console.error('Error limpiando datos de test:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

cleanTestData();
