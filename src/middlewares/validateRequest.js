function validateRequest(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'El body debe enviarse en formato JSON',
      });
    }

    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      );
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Campos requeridos faltantes: ${missing.join(', ')}`,
      });
    }

    return next();
  };
}

module.exports = validateRequest;
