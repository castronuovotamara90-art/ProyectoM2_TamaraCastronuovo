import request from 'supertest';
import { loadEnvFile } from 'node:process';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

let app;

describe('Posts API', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeAll(async () => {
		loadEnvFile('.env');
		({ default: app } = await import('../src/server.js'));
	});

	test('debe devolver 400 si falta title', async () => {
		const payload = {
			content: 'Contenido sin titulo',
			author_id: 1,
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos requeridos faltantes');
		expect(response.body.error).toContain('title');
	});

	test('debe devolver 400 si title esta vacio', async () => {
		const payload = {
			title: '   ',
			content: 'Contenido valido',
			author_id: 1,
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos requeridos faltantes');
		expect(response.body.error).toContain('title');
	});

	test('debe devolver 400 si falta content', async () => {
		const payload = {
			title: 'Post sin content',
			author_id: 1,
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos requeridos faltantes');
		expect(response.body.error).toContain('content');
	});

	test('debe devolver 400 si content esta vacio', async () => {
		const payload = {
			title: 'Post con content vacio',
			content: '   ',
			author_id: 1,
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos requeridos faltantes');
		expect(response.body.error).toContain('content');
	});

	test('debe devolver 400 si falta author_id', async () => {
		const payload = {
			title: 'Post sin author',
			content: 'Contenido sin autor',
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos requeridos faltantes');
		expect(response.body.error).toContain('author_id');
	});

	test('debe crear un post', async () => {
		const unique = Date.now();
		const authorPayload = {
			name: `Author Post ${unique}`,
			email: `author.post.${unique}@example.com`,
			bio: 'Autor para crear post',
		};

		const authorResponse = await request(app).post('/api/authors').send(authorPayload);

		expect(authorResponse.status).toBe(201);
		expect(authorResponse.body).toHaveProperty('id');
		expect(authorResponse.body.id).toBeDefined();

		const postPayload = {
			title: `Post de prueba ${unique}`,
			content: 'Contenido de prueba',
			author_id: authorResponse.body.id,
			published: true,
		};

		const postResponse = await request(app).post('/api/posts').send(postPayload);

		expect(postResponse.status).toBe(201);
		expect(postResponse.body).toHaveProperty('id');
		expect(postResponse.body.id).toBeDefined();
		expect(postResponse.body.title).toContain('Post de prueba');
		expect(postResponse.body).toMatchObject({
			title: postPayload.title,
			content: postPayload.content,
			author_id: postPayload.author_id,
			published: true,
		});
		expect(postResponse.body).toHaveProperty('author');
		expect(postResponse.body.author).toMatchObject({
			id: authorResponse.body.id,
			name: authorResponse.body.name,
			email: authorResponse.body.email,
		});
	});

	test('debe aceptar author_id numerico como string', async () => {
		const unique = Date.now();
		const authorPayload = {
			name: `Author String ID ${unique}`,
			email: `author.string.id.${unique}@example.com`,
		};

		const authorResponse = await request(app).post('/api/authors').send(authorPayload);

		expect(authorResponse.status).toBe(201);

		const payload = {
			title: `Post con author_id string ${unique}`,
			content: 'Contenido valido',
			author_id: String(authorResponse.body.id),
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(201);
		expect(response.body.author_id).toBe(authorResponse.body.id);
		expect(response.body).toHaveProperty('author');
		expect(response.body.author.id).toBe(authorResponse.body.id);
	});

	test('debe devolver 400 si author_id es string invalido', async () => {
		const payload = {
			title: 'Post invalido author_id',
			content: 'Contenido invalido',
			author_id: '12abc',
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('entero positivo');
	});

	test('debe devolver 400 si published no es true o false', async () => {
		const payload = {
			title: 'Post published invalido',
			content: 'Contenido valido',
			author_id: 1,
			published: 'banana',
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('booleano');
	});

	test('debe devolver 400 si envia campos extra no permitidos en post', async () => {
		const unique = Date.now();
		const authorPayload = {
			name: `Author Extra Field ${unique}`,
			email: `author.extra.field.${unique}@example.com`,
		};

		const authorResponse = await request(app).post('/api/authors').send(authorPayload);

		expect(authorResponse.status).toBe(201);

		const payload = {
			title: `Post con campo extra ${unique}`,
			content: 'Contenido',
			author_id: authorResponse.body.id,
			tags: ['node', 'express'],
		};

		const response = await request(app).post('/api/posts').send(payload);

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('Campos no permitidos');
	});

	test('debe devolver la lista de posts', async () => {
		const response = await request(app).get('/api/posts');

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body).toBeTruthy();
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0]).toHaveProperty('id');
		expect(response.body[0]).toHaveProperty('title');
		expect(response.body[0]).toHaveProperty('author');
		expect(response.body[0].author).toHaveProperty('id');
		expect(response.body[0].author).toHaveProperty('email');
	});

	test('debe devolver 200 al filtrar posts publicados', async () => {
		const response = await request(app).get('/api/posts?published=true');

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	test('debe devolver 200 al filtrar posts no publicados', async () => {
		const response = await request(app).get('/api/posts?published=false');

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	test('debe devolver 400 si published en query es invalido', async () => {
		const response = await request(app).get('/api/posts?published=banana');

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('true o false');
	});

	test('debe actualizar un post', async () => {
		const unique = Date.now();
		const authorPayload = {
			name: `Author Update Post ${unique}`,
			email: `author.update.post.${unique}@example.com`,
		};

		const authorResponse = await request(app).post('/api/authors').send(authorPayload);
		expect(authorResponse.status).toBe(201);

		const createPayload = {
			title: `Post Update ${unique}`,
			content: 'Contenido original',
			author_id: authorResponse.body.id,
			published: true,
		};

		const createResponse = await request(app).post('/api/posts').send(createPayload);
		expect(createResponse.status).toBe(201);

		const updatePayload = {
			title: `Post Update ${unique} editado`,
			published: false,
		};

		const updateResponse = await request(app)
			.put(`/api/posts/${createResponse.body.id}`)
			.send(updatePayload);

		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body.title).toBe(updatePayload.title);
		expect(updateResponse.body.published).toBe(false);
	});

	test('debe eliminar un post', async () => {
		const unique = Date.now();
		const authorPayload = {
			name: `Author Delete Post ${unique}`,
			email: `author.delete.post.${unique}@example.com`,
		};

		const authorResponse = await request(app).post('/api/authors').send(authorPayload);
		expect(authorResponse.status).toBe(201);

		const createPayload = {
			title: `Post Delete ${unique}`,
			content: 'Contenido para eliminar',
			author_id: authorResponse.body.id,
		};

		const createResponse = await request(app).post('/api/posts').send(createPayload);
		expect(createResponse.status).toBe(201);

		const deleteResponse = await request(app)
			.delete(`/api/posts/${createResponse.body.id}`);

		expect(deleteResponse.status).toBe(204);
		expect(deleteResponse.body).toEqual({});

		const getResponse = await request(app).get(`/api/posts/${createResponse.body.id}`);
		expect(getResponse.status).toBe(404);
	});

	test('debe devolver 404 si el post no existe', async () => {
		const response = await request(app).get('/api/posts/999999');

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toContain('no encontrado');
		expect(response.body).toEqual({
			error: 'Post no encontrado',
		});
	});

	test('debe devolver 400 si el id del post no es valido', async () => {
		const response = await request(app).get('/api/posts/abc');

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('entero positivo');
	});

	test('debe devolver 400 si authorId de ruta no es valido', async () => {
		const response = await request(app).get('/api/posts/author/abc');

		expect(response.status).toBe(400);
		expect(response.body.error).toContain('entero positivo');
	});

});
