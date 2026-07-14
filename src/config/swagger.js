const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Blog API',
    version: '1.0.0',
    description: 'Documentacion base de la API de autores y posts.',
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' ? 'https://fsm2miniblog-production.up.railway.app' : 'http://localhost:3000',
    },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Authors' },
    { name: 'Posts' },
  ],
  components: {
    schemas: {
      Author: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ana Garcia' },
          email: { type: 'string', format: 'email', example: 'ana@example.com' },
          bio: { type: 'string', example: 'Desarrolladora full-stack' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      AuthorInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Ana Garcia' },
          email: { type: 'string', format: 'email', example: 'ana@example.com' },
          bio: { type: 'string', example: 'Desarrolladora full-stack' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Introduccion a Node.js' },
          content: { type: 'string', example: 'Contenido del post' },
          author_id: { type: 'integer', example: 1 },
          published: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          author: { $ref: '#/components/schemas/Author' },
        },
      },
      PostInput: {
        type: 'object',
        required: ['title', 'content', 'author_id'],
        properties: {
          title: { type: 'string', example: 'Introduccion a Node.js' },
          content: { type: 'string', example: 'Contenido del post' },
          author_id: { type: 'integer', example: 1 },
          published: { type: 'boolean', example: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensaje de error' },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Error de validacion',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            examples: {
              invalidField: {
                value: { error: 'El campo author_id debe ser un entero positivo' },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            examples: {
              notFound: {
                value: { error: 'Recurso no encontrado' },
              },
            },
          },
        },
      },
      InternalError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            examples: {
              serverError: {
                value: { error: 'Error interno del servidor' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Estado general de la API',
        responses: {
          '200': {
            description: 'API activa',
            content: {
              'application/json': {
                example: {
                  message: 'Blog API',
                  endpoints: {
                    authors: '/api/authors',
                    posts: '/api/posts',
                    docs: '/api-docs/',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/authors': {
      get: {
        tags: ['Authors'],
        summary: 'Listar autores',
        responses: {
          '200': {
            description: 'Lista de autores',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Author' },
                },
                examples: {
                  sample: {
                    value: [
                      {
                        id: 1,
                        name: 'Ana Garcia',
                        email: 'ana@example.com',
                        bio: 'Desarrolladora full-stack',
                        created_at: '2026-07-09T10:00:00.000Z',
                      },
                    ],
                  },
                },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Authors'],
        summary: 'Crear autor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthorInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Autor creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Author' },
                examples: {
                  created: {
                    value: {
                      id: 10,
                      name: 'Ana Garcia',
                      email: 'ana@example.com',
                      bio: 'Desarrolladora full-stack',
                      created_at: '2026-07-09T10:05:00.000Z',
                    },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/authors/{id}': {
      get: {
        tags: ['Authors'],
        summary: 'Obtener autor por ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Autor encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Author' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Authors'],
        summary: 'Actualizar autor',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ana Garcia actualizada' },
                  email: { type: 'string', format: 'email', example: 'ana.garcia@example.com' },
                  bio: { type: 'string', example: 'Backend developer enfocada en Node.js y PostgreSQL' },
                },
              },
              examples: {
                partialUpdate: {
                  value: {
                    name: 'Ana Garcia actualizada',
                    bio: 'Backend developer enfocada en Node.js y PostgreSQL',
                  },
                },
                fullUpdate: {
                  value: {
                    name: 'Ana Garcia',
                    email: 'ana.garcia@example.com',
                    bio: 'Backend developer enfocada en APIs REST',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autor actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Author' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Authors'],
        summary: 'Eliminar autor',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '204': {
            description: 'Autor eliminado',
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Listar posts',
        parameters: [
          {
            in: 'query',
            name: 'published',
            required: false,
            schema: {
              type: 'string',
              enum: ['true', 'false'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de posts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
                examples: {
                  sample: {
                    value: [
                      {
                        id: 1,
                        title: 'Introduccion a Node.js',
                        content: 'Contenido del post',
                        author_id: 1,
                        published: true,
                        created_at: '2026-07-09T10:10:00.000Z',
                        author: {
                          id: 1,
                          name: 'Ana Garcia',
                          email: 'ana@example.com',
                          bio: 'Desarrolladora full-stack',
                          created_at: '2026-07-09T10:00:00.000Z',
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Crear post',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Post creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Post' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Obtener post por ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Post encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Post' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Posts'],
        summary: 'Actualizar post',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Introduccion a Node.js (actualizado)' },
                  content: { type: 'string', example: 'Contenido actualizado del post sobre Node.js y su ecosistema.' },
                  published: { type: 'boolean', example: true },
                },
              },
              examples: {
                editDraft: {
                  value: {
                    title: 'Introduccion a Node.js (actualizado)',
                    content: 'Contenido actualizado del post sobre Node.js y su ecosistema.',
                    published: false,
                  },
                },
                publishOnly: {
                  value: {
                    published: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Post actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Post' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Eliminar post',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '204': {
            description: 'Post eliminado',
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/posts/author/{authorId}': {
      get: {
        tags: ['Posts'],
        summary: 'Listar posts por autor',
        parameters: [
          {
            in: 'path',
            name: 'authorId',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de posts del autor',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;