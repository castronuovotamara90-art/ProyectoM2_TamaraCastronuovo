import request from 'supertest';
import { loadEnvFile } from 'node:process';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

let app;

describe('Authors API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(async () => {
    loadEnvFile('.env');
    ({ default: app } = await import('../src/server.js'));
  });

  test('debe devolver 400 si falta email', async () => {
    const unique = Date.now();
    const payload = {
      name: `Autor sin email ${unique}`,
      bio: 'Sin email en el body',
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('email');
    expect(response.body.error).toMatch(/email/i);
  });

  test('debe devolver 400 si falta name', async () => {
    const unique = Date.now();
    const payload = {
      email: `sin.name.${unique}@example.com`,
      bio: 'Sin name en el body',
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('name');
    expect(response.body.error).toContain('Campos requeridos faltantes');
  });

  test('debe devolver 400 si name esta vacio', async () => {
    const unique = Date.now();
    const payload = {
      name: '   ',
      email: `name.vacio.${unique}@example.com`,
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('name');
    expect(response.body.error).toContain('Campos requeridos faltantes');
  });

  test('debe devolver 400 si el body no es JSON', async () => {
    const response = await request(app)
      .post('/api/authors')
      .set('Content-Type', 'text/plain')
      .send('no es json');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('JSON');
  });

  test('debe devolver 400 si name es null', async () => {
    const unique = Date.now();
    const payload = {
      name: null,
      email: `null.name.${unique}@example.com`,
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Campos requeridos faltantes');
  });

  test('debe devolver 400 si envia campos extra no permitidos', async () => {
    const unique = Date.now();
    const payload = {
      name: `Autor extra ${unique}`,
      email: `extra.${unique}@example.com`,
      admin: true,
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Campos no permitidos');
  });

  test('debe crear un author', async () => {
    const unique = Date.now();
    const payload = {
      name: `Test Author ${unique}`,
      email: `test.author.${unique}@example.com`,
      bio: 'Autor creado desde test',
    };

    const response = await request(app).post('/api/authors').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(response.body).toMatchObject({
      name: payload.name,
      email: payload.email,
      bio: payload.bio,
    });
  });

  test('debe actualizar un author', async () => {
    const unique = Date.now();
    const createPayload = {
      name: `Author Update ${unique}`,
      email: `author.update.${unique}@example.com`,
      bio: 'Bio original',
    };

    const createResponse = await request(app).post('/api/authors').send(createPayload);
    expect(createResponse.status).toBe(201);

    const updatePayload = {
      name: `Author Update ${unique} editado`,
      bio: 'Bio editada',
    };

    const updateResponse = await request(app)
      .put(`/api/authors/${createResponse.body.id}`)
      .send(updatePayload);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe(updatePayload.name);
    expect(updateResponse.body.bio).toBe(updatePayload.bio);
  });

  test('debe eliminar un author', async () => {
    const unique = Date.now();
    const createPayload = {
      name: `Author Delete ${unique}`,
      email: `author.delete.${unique}@example.com`,
      bio: 'Bio para eliminar',
    };

    const createResponse = await request(app).post('/api/authors').send(createPayload);
    expect(createResponse.status).toBe(201);

    const deleteResponse = await request(app)
      .delete(`/api/authors/${createResponse.body.id}`);

    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.body).toEqual({});

    const getResponse = await request(app).get(`/api/authors/${createResponse.body.id}`);
    expect(getResponse.status).toBe(404);
  });

  test('debe devolver la lista de autores', async () => {
    const response = await request(app).get('/api/authors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('email');
  });

  test('debe devolver 400 si el email ya existe', async () => {
    const unique = Date.now();
    const payload = {
      name: `Autor repetido ${unique}`,
      email: `duplicado.${unique}@example.com`,
      bio: 'Primera creacion',
    };

    const firstResponse = await request(app).post('/api/authors').send(payload);
    expect(firstResponse.status).toBe(201);

    const secondPayload = {
      ...payload,
      name: `Autor repetido segunda vez ${unique}`,
    };

    const secondResponse = await request(app).post('/api/authors').send(secondPayload);

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body).toHaveProperty('error');
    expect(secondResponse.body.error).toContain('registrado');
    expect(secondResponse.body).toEqual({
      error: 'El email ya esta registrado',
    });
  });

  test('debe devolver 404 si el autor no existe', async () => {
    const response = await request(app).get('/api/authors/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('no encontrado');
    expect(response.body).toEqual({
      error: 'Autor no encontrado',
    });
  });

  test('debe devolver 400 si el id del autor no es valido', async () => {
    const response = await request(app).get('/api/authors/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('entero positivo');
  });

});
