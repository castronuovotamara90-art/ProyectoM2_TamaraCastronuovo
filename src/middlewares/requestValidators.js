const {
  validarTextoNoVacio,
  validarEmail,
  parsearYValidarEnteroPositivo,
  validarBooleanoOpcional,
  validarCamposPermitidos,
} = require('../utils/validators');

function validateIdParam(paramName = 'id') {
  return (req, res, next) => {
    const { value, error } = parsearYValidarEnteroPositivo(req.params[paramName], paramName);
    if (error) {
      return res.status(400).json({ error });
    }

    req.params[paramName] = value;
    return next();
  };
}

function validatePublishedQuery(req, res, next) {
  const { published } = req.query;

  if (published === undefined) {
    req.validated = { ...req.validated, published: undefined };
    return next();
  }

  if (published === 'true') {
    req.validated = { ...req.validated, published: true };
    return next();
  }

  if (published === 'false') {
    req.validated = { ...req.validated, published: false };
    return next();
  }

  return res.status(400).json({ error: 'published debe ser true o false' });
}

function validateCreateAuthor(req, res, next) {
  const errorCampos = validarCamposPermitidos(req.body, ['name', 'email', 'bio']);
  if (errorCampos) {
    return res.status(400).json({ error: errorCampos });
  }

  const errorNombre = validarTextoNoVacio(req.body.name, 'name');
  if (errorNombre) {
    return res.status(400).json({ error: errorNombre });
  }

  const errorEmail = validarEmail(req.body.email);
  if (errorEmail) {
    return res.status(400).json({ error: errorEmail });
  }

  return next();
}

function validateUpdateAuthor(req, res, next) {
  const errorCampos = validarCamposPermitidos(req.body, ['name', 'email', 'bio']);
  if (errorCampos) {
    return res.status(400).json({ error: errorCampos });
  }

  if (req.body.name !== undefined) {
    const errorNombre = validarTextoNoVacio(req.body.name, 'name');
    if (errorNombre) {
      return res.status(400).json({ error: errorNombre });
    }
  }

  if (req.body.email !== undefined) {
    const errorEmail = validarEmail(req.body.email);
    if (errorEmail) {
      return res.status(400).json({ error: errorEmail });
    }
  }

  return next();
}

function normalizeAuthorEmail(req, res, next) {
  if (typeof req.body.email === 'string') {
    req.body.email = req.body.email.trim().toLowerCase();
  }

  return next();
}

function validateCreatePost(req, res, next) {
  const errorCampos = validarCamposPermitidos(req.body, [
    'title',
    'content',
    'author_id',
    'published',
  ]);
  if (errorCampos) {
    return res.status(400).json({ error: errorCampos });
  }

  const errorTitulo = validarTextoNoVacio(req.body.title, 'title');
  if (errorTitulo) {
    return res.status(400).json({ error: errorTitulo });
  }

  const errorContenido = validarTextoNoVacio(req.body.content, 'content');
  if (errorContenido) {
    return res.status(400).json({ error: errorContenido });
  }

  const { value: parsedAuthorId, error: errorAuthorId } =
    parsearYValidarEnteroPositivo(req.body.author_id, 'author_id');
  if (errorAuthorId) {
    return res.status(400).json({ error: errorAuthorId });
  }

  const errorPublished = validarBooleanoOpcional(req.body.published, 'published');
  if (errorPublished) {
    return res.status(400).json({ error: errorPublished });
  }

  req.body.author_id = parsedAuthorId;
  return next();
}

function validateUpdatePost(req, res, next) {
  const errorCampos = validarCamposPermitidos(req.body, ['title', 'content', 'published']);
  if (errorCampos) {
    return res.status(400).json({ error: errorCampos });
  }

  if (req.body.title !== undefined) {
    const errorTitulo = validarTextoNoVacio(req.body.title, 'title');
    if (errorTitulo) {
      return res.status(400).json({ error: errorTitulo });
    }
  }

  if (req.body.content !== undefined) {
    const errorContenido = validarTextoNoVacio(req.body.content, 'content');
    if (errorContenido) {
      return res.status(400).json({ error: errorContenido });
    }
  }

  const errorPublished = validarBooleanoOpcional(req.body.published, 'published');
  if (errorPublished) {
    return res.status(400).json({ error: errorPublished });
  }

  return next();
}

module.exports = {
  validateIdParam,
  validatePublishedQuery,
  validateCreateAuthor,
  validateUpdateAuthor,
  normalizeAuthorEmail,
  validateCreatePost,
  validateUpdatePost,
};