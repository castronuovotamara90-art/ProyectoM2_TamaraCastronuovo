const pool = require('../config/dbConnect');

async function getAllAuthors() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, bio, created_at FROM authors ORDER BY id ASC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error obteniendo autores:', error.message);
    throw error;
  }
}

async function getAuthorById(id) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error obteniendo autor por id:', error.message);
    throw error;
  }
}

async function createAuthor({ name, email, bio = '' }) {
  try {
    const result = await pool.query(
      `INSERT INTO authors (name, email, bio)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, bio, created_at`,
      [name, email, bio]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creando autor:', error.message);
    throw error;
  }
}

async function updateAuthor(id, { name, email, bio }) {
  try {
    const current = await getAuthorById(id);
    if (!current) return null;

    const result = await pool.query(
      `UPDATE authors
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           bio = COALESCE($3, bio)
       WHERE id = $4
       RETURNING id, name, email, bio, created_at`,
      [name, email, bio, id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error actualizando autor:', error.message);
    throw error;
  }
}

async function deleteAuthor(id) {
  try {
    const result = await pool.query(
      'DELETE FROM authors WHERE id = $1',
      [id]
    );

    return result.rowCount;
  } catch (error) {
    console.error('Error eliminando autor:', error.message);
    throw error;
  }
}

async function searchAuthors(filters) {
  let sql = 'SELECT id, name, email, bio, created_at FROM authors WHERE 1=1';
  const valores = [];
  let paramIndex = 1;

  if (filters.name) {
    sql += ` AND name ILIKE $${paramIndex}`;
    valores.push(`%${filters.name}%`);
    paramIndex++;
  }

  if (filters.email) {
    sql += ` AND email = $${paramIndex}`;
    valores.push(filters.email);
    paramIndex++;
  }

  try {
    const result = await pool.query(sql, valores);
    return result.rows;
  } catch (error) {
    console.error('Error buscando autores:', error.message);
    throw error;
  }
}

async function getAuthorsOrdered(campoOrden = 'name', direccion = 'ASC') {
  const camposPermitidos = ['name', 'email', 'created_at'];
  const direccionesPermitidas = ['ASC', 'DESC'];

  if (!camposPermitidos.includes(campoOrden)) {
    throw new Error('Campo de orden inválido');
  }

  if (!direccionesPermitidas.includes(direccion.toUpperCase())) {
    throw new Error('Dirección de orden inválida');
  }

  const sql = `SELECT id, name, email, bio, created_at FROM authors ORDER BY ${campoOrden} ${direccion.toUpperCase()}`;

  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error('Error obteniendo autores ordenados:', error.message);
    throw error;
  }
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
  getAuthorsOrdered,
};
