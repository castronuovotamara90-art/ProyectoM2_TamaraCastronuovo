const postsService = require('../services/postsService');

async function getPosts(req, res, next) {
  try {
    const normalizedPublished = req.validated?.published;

    const posts = await postsService.getAllPosts({ published: normalizedPublished });
    return res.json(posts);
  } catch (error) {
    console.error('Error en GET /api/posts:', error.message);
    return res.status(500).json({ error: 'Error obteniendo posts' });
  }
}

async function getPostById(req, res, next) {
  try {
    const id = req.params.id;

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Error en GET /api/posts/:id:', error.message);
    return res.status(500).json({ error: 'Error obteniendo post' });
  }
}

async function getPostsByAuthor(req, res, next) {
  try {
    const authorId = req.params.authorId;

    const posts = await postsService.getPostsByAuthor(authorId);
    return res.json(posts);
  } catch (error) {
    console.error('Error en GET /api/posts/author/:authorId:', error.message);
    return res.status(500).json({ error: 'Error obteniendo posts por autor' });
  }
}

async function createPost(req, res, next) {
  try {
    const post = await postsService.createPost(req.body);
    return res.status(201).json(post);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({ error: 'El autor especificado no existe' });
    }
    console.error('Error en POST /api/posts:', error.message);
    return res.status(500).json({ error: 'Error creando post' });
  }
}

async function updatePost(req, res, next) {
  try {
    const id = req.params.id;

    const post = await postsService.updatePost(id, req.body);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Error en PUT /api/posts/:id:', error.message);
    return res.status(500).json({ error: 'Error actualizando post' });
  }
}

async function deletePost(req, res, next) {
  try {
    const id = req.params.id;

    const rowCount = await postsService.deletePost(id);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error en DELETE /api/posts/:id:', error.message);
    return res.status(500).json({ error: 'Error eliminando post' });
  }
}

module.exports = {
  getPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
};
