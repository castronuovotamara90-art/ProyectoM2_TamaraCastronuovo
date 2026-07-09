function validarTextoNoVacio(valor, nombreCampo) {
  if (valor === undefined) {
    return `El campo ${nombreCampo} es requerido`;
  }

  if (valor === null) {
    return `El campo ${nombreCampo} no puede ser null`;
  }

  if (typeof valor !== 'string') {
    return `El campo ${nombreCampo} debe ser texto`;
  }

  if (valor.trim().length === 0) {
    return `El campo ${nombreCampo} no puede estar vacio`;
  }

  return null;
}

function validarEmail(email) {
  if (email === undefined) {
    return 'El email es requerido';
  }

  if (email === null) {
    return 'El email no puede ser null';
  }

  if (typeof email !== 'string') {
    return 'El email debe ser texto';
  }

  const emailNormalizado = email.trim().toLowerCase();
  if (emailNormalizado.length > 254) {
    return 'El email es demasiado largo';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailNormalizado)) {
    return 'El formato del email es invalido';
  }

  const [usuario, dominio] = emailNormalizado.split('@');

  if (usuario.length > 64) {
    return 'La parte local del email es demasiado larga';
  }

  if (usuario.startsWith('.') || usuario.endsWith('.')) {
    return 'El email no puede comenzar o terminar con punto';
  }

  if (usuario.includes('..')) {
    return 'El email no puede tener puntos consecutivos';
  }

  if (dominio.length < 3 || !dominio.includes('.')) {
    return 'El dominio del email es invalido';
  }

  return null;
}

function validarEnteroPositivo(valor, nombreCampo) {
  if (!Number.isInteger(valor) || valor <= 0) {
    return `El campo ${nombreCampo} debe ser un entero positivo`;
  }

  return null;
}

function parsearYValidarEnteroPositivo(valor, nombreCampo) {
  if (typeof valor === 'number') {
    const error = validarEnteroPositivo(valor, nombreCampo);
    if (error) return { error };
    return { value: valor };
  }

  if (typeof valor === 'string') {
    const trimmed = valor.trim();
    if (!/^\d+$/.test(trimmed)) {
      return { error: `El campo ${nombreCampo} debe ser un entero positivo` };
    }

    const parsed = Number.parseInt(trimmed, 10);
    const error = validarEnteroPositivo(parsed, nombreCampo);
    if (error) return { error };
    return { value: parsed };
  }

  return { error: `El campo ${nombreCampo} debe ser un entero positivo` };
}

function validarBooleanoOpcional(valor, nombreCampo) {
  if (valor === undefined) return null;

  if (typeof valor !== 'boolean') {
    return `El campo ${nombreCampo} debe ser booleano`;
  }

  return null;
}

function validarCamposPermitidos(datos, camposPermitidos) {
  const camposRecibidos = Object.keys(datos || {});
  const camposExtra = camposRecibidos.filter(
    (campo) => !camposPermitidos.includes(campo)
  );

  if (camposExtra.length > 0) {
    return `Campos no permitidos: ${camposExtra.join(', ')}`;
  }

  return null;
}

module.exports = {
  validarTextoNoVacio,
  validarEmail,
  validarEnteroPositivo,
  parsearYValidarEnteroPositivo,
  validarBooleanoOpcional,
  validarCamposPermitidos,
};
