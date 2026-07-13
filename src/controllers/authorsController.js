const authorsService = require('../services/authorsService');

async function getAuthors(req, res, next) {
  try {
    const authors = await authorsService.getAllAuthors();
    return res.json(authors);
  } catch (error) {
    console.error('Error en GET /api/authors:', error.message);
    return res.status(500).json({ error: 'Error obteniendo autores' });
  }
}

async function getAuthorById(req, res, next) {
  try {
    const id = req.params.id;

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    return res.json(author);
  } catch (error) {
    console.error('Error en GET /api/authors/:id:', error.message);
    return res.status(500).json({ error: 'Error obteniendo autor' });
  }
}

async function createAuthor(req, res, next) {
  try {
    const author = await authorsService.createAuthor(req.body);
    return res.status(201).json(author);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }
    console.error('Error en POST /api/authors:', error.message);
    return res.status(500).json({ error: 'Error creando autor' });
  }
}

async function updateAuthor(req, res, next) {
  try {
    const id = req.params.id;

    const author = await authorsService.updateAuthor(id, req.body);

    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    return res.json(author);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }
    console.error('Error en PUT /api/authors/:id:', error.message);
    return res.status(500).json({ error: 'Error actualizando autor' });
  }
}

async function deleteAuthor(req, res, next) {
  try {
    const id = req.params.id;

    const rowCount = await authorsService.deleteAuthor(id);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error en DELETE /api/authors/:id:', error.message);
    return res.status(500).json({ error: 'Error eliminando autor' });
  }
}

async function searchAuthors(req, res, next) {
  try {
    const { name, email } = req.query;
    const authors = await authorsService.searchAuthors({ name, email });
    return res.json(authors);
  } catch (error) {
    console.error('Error en GET /api/authors/search:', error.message);
    return res.status(500).json({ error: 'Error buscando autores' });
  }
}

async function getAuthorsOrdered(req, res, next) {
  try {
    const { orderBy = 'name', direction = 'ASC' } = req.query;
    const authors = await authorsService.getAuthorsOrdered(orderBy, direction);
    return res.json(authors);
  } catch (error) {
    if (error.message === 'Campo de orden inválido' || error.message === 'Dirección de orden inválida') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error en GET /api/authors/ordered:', error.message);
    return res.status(500).json({ error: 'Error obteniendo autores ordenados' });
  }
}

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
  getAuthorsOrdered,
};
