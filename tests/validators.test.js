import { describe, expect, test } from 'vitest';
import validatorsModule from '../src/utils/validators.js';

const {
  validarTextoNoVacio,
  validarEmail,
  validarEnteroPositivo,
  parsearYValidarEnteroPositivo,
  validarBooleanoOpcional,
  validarCamposPermitidos,
} = validatorsModule;

describe('validadores manuales', () => {
  test('validarTextoNoVacio acepta string valido', () => {
    expect(validarTextoNoVacio('Tamara', 'name')).toBeNull();
  });

  test('validarTextoNoVacio rechaza string vacio', () => {
    expect(validarTextoNoVacio('   ', 'name')).toContain('no puede estar vacio');
  });

  test('validarTextoNoVacio diferencia undefined y null', () => {
    expect(validarTextoNoVacio(undefined, 'name')).toContain('es requerido');
    expect(validarTextoNoVacio(null, 'name')).toContain('no puede ser null');
  });

  test('validarEmail acepta formato valido', () => {
    expect(validarEmail('test@example.com')).toBeNull();
  });

  test('validarEmail rechaza formato invalido', () => {
    expect(validarEmail('testexample.com')).toContain('invalido');
  });

  test('validarEmail rechaza puntos consecutivos en usuario', () => {
    expect(validarEmail('juan..perez@example.com')).toContain('puntos consecutivos');
  });

  test('validarEnteroPositivo acepta entero positivo', () => {
    expect(validarEnteroPositivo(3, 'author_id')).toBeNull();
  });

  test('validarEnteroPositivo rechaza cero o negativos', () => {
    expect(validarEnteroPositivo(0, 'author_id')).toContain('entero positivo');
  });

  test('parsearYValidarEnteroPositivo convierte strings numericos', () => {
    expect(parsearYValidarEnteroPositivo('15', 'author_id')).toEqual({ value: 15 });
  });

  test('parsearYValidarEnteroPositivo rechaza strings no numericos', () => {
    expect(parsearYValidarEnteroPositivo('15abc', 'author_id').error).toContain('entero positivo');
  });

  test('validarBooleanoOpcional acepta undefined', () => {
    expect(validarBooleanoOpcional(undefined, 'published')).toBeNull();
  });

  test('validarBooleanoOpcional rechaza tipo invalido', () => {
    expect(validarBooleanoOpcional('true', 'published')).toContain('booleano');
  });

  test('validarCamposPermitidos detecta campos extra', () => {
    expect(validarCamposPermitidos(
      { name: 'Ana', email: 'ana@example.com', admin: true },
      ['name', 'email', 'bio']
    )).toContain('Campos no permitidos');
  });
});
