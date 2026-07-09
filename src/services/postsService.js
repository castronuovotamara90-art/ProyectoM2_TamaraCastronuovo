const pool = require('../config/dbConnect');

function mapPostWithAuthor(row) {
  if (!row) return null;

  return {
    id: row.post_id,
    title: row.post_title,
    content: row.post_content,
    author_id: row.post_author_id,
    published: row.published,
    created_at: row.post_created_at,
    author: {
      id: row.author_id,
      name: row.author_name,
      email: row.author_email,
      bio: row.author_bio,
      created_at: row.author_created_at,
    },
  };
}

async function getPostsWithAuthorClause(whereClause = '', values = []) {
  const sql = `
    SELECT
      p.id AS post_id,
      p.title AS post_title,
      p.content AS post_content,
      p.author_id AS post_author_id,
      p.published,
      p.created_at AS post_created_at,
      a.id AS author_id,
      a.name AS author_name,
      a.email AS author_email,
      a.bio AS author_bio,
      a.created_at AS author_created_at
    FROM posts AS p
    INNER JOIN authors AS a
      ON p.author_id = a.id
    ${whereClause}
    ORDER BY p.id ASC
  `;

  const result = await pool.query(sql, values);
  return result.rows.map(mapPostWithAuthor);
}

async function getAllPosts({ published }) {
  try {
    if (published === undefined) {
      return await getPostsWithAuthorClause();
    }

    return await getPostsWithAuthorClause('WHERE p.published = $1', [published]);
  } catch (error) {
    console.error('Error obteniendo posts:', error.message);
    throw error;
  }
}

async function getPostById(id) {
  try {
    const rows = await getPostsWithAuthorClause('WHERE p.id = $1', [id]);

    return rows[0] || null;
  } catch (error) {
    console.error('Error obteniendo post por id:', error.message);
    throw error;
  }
}

async function getPostsByAuthor(authorId) {
  try {
    return await getPostsWithAuthorClause('WHERE p.author_id = $1', [authorId]);
  } catch (error) {
    console.error('Error obteniendo posts por autor:', error.message);
    throw error;
  }
}

async function createPost({ title, content, author_id, published = false }) {
  try {
    const result = await pool.query(
      `INSERT INTO posts (title, content, author_id, published)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, author_id, published, created_at`,
      [title, content, author_id, published]
    );

    return await getPostById(result.rows[0].id);
  } catch (error) {
    console.error('Error creando post:', error.message);
    throw error;
  }
}

async function updatePost(id, { title, content, published }) {
  try {
    const current = await getPostById(id);
    if (!current) return null;

    const result = await pool.query(
      `UPDATE posts
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           published = COALESCE($3, published)
       WHERE id = $4
       RETURNING id, title, content, author_id, published, created_at`,
      [title, content, published, id]
    );

    return await getPostById(result.rows[0].id);
  } catch (error) {
    console.error('Error actualizando post:', error.message);
    throw error;
  }
}

async function deletePost(id) {
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1',
      [id]
    );

    return result.rowCount;
  } catch (error) {
    console.error('Error eliminando post:', error.message);
    throw error;
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
};
