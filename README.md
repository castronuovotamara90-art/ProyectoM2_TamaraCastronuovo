# ProyectoM2_TamaraCastronuovo

API REST para gestionar autores y publicaciones de blog, construida con Express y PostgreSQL.

## Descripcion del proyecto

Este proyecto implementa un backend CRUD para administrar autores y posts de un mini blog. La API permite crear, listar, actualizar y eliminar autores y publicaciones, aplicando validaciones de entrada y persistencia en PostgreSQL.

El modelo de datos se basa en una relacion 1:N entre autores y posts: un autor puede tener muchos posts y cada post pertenece a un autor.

El proyecto incluye:

- Endpoints para autores y posts.
- Validaciones de datos de entrada.
- Persistencia en PostgreSQL con relacion 1:N entre authors y posts.
- Documentacion OpenAPI expuesta con Swagger UI.
- Tests automatizados con Vitest y Supertest.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- pg
- Swagger UI Express
- Vitest
- Supertest

## Estructura del repositorio

- src/: codigo fuente de la API.
- src/db/setup.sql: script SQL de creacion de tablas y datos iniciales (setup + seed).
- tests/: tests automatizados.
- .env.example: plantilla de variables de entorno.
- src/config/swagger.js: especificacion OpenAPI usada por Swagger UI.
- src/docs/swagger.yaml: archivo OpenAPI en formato YAML.

## Requisitos previos

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Variables de entorno

Crear un archivo .env en la raiz del proyecto tomando como base .env.example.

Para despliegue (Railway), puede usarse DATABASE_URL o las variables DB_*.

## Instalacion y ejecucion local

1. Instalar dependencias:

```bash
npm install
```

2. Inicializar base de datos (tablas + seed):

```bash
npm run db:init
```

3. Levantar API local:

```bash
npm start
```

4. Levantar API en modo desarrollo:

```bash
npm run dev
```

## Testing

Ejecutar toda la suite:

```bash
npm test
```

Ejecutar suites puntuales:

```bash
npm test -- tests/authors.test.js
npm test -- tests/posts.test.js
npm test -- tests/validators.test.js
```

Modo watch:

```bash
npm run test:watch
```

## OpenAPI y Swagger

- Swagger UI local: http://localhost:3000/api-docs/
- Swagger UI produccion: https://fsm2miniblog-production.up.railway.app/api-docs/#/Authors/get_api_authors
- Alias: http://localhost:3000/docs y http://localhost:3000/swagger
- OpenAPI runtime (fuente canonicamente usada): src/config/swagger.js
- OpenAPI archivo YAML: src/docs/swagger.yaml

## Endpoints principales

Authors:

- GET /api/authors
- GET /api/authors/{id}
- GET /api/authors/search
- GET /api/authors/ordered
- POST /api/authors
- PUT /api/authors/{id}
- DELETE /api/authors/{id}

Posts:

- GET /api/posts
- GET /api/posts/{id}
- GET /api/posts/author/{authorId}
- POST /api/posts
- PUT /api/posts/{id}
- DELETE /api/posts/{id}

## Deploy en Railway (resumen)

1. Crear servicio API y servicio PostgreSQL en el mismo proyecto.
2. Configurar variables del servicio API:

	- NODE_ENV=production
	- DATABASE_URL (referencia a Postgres)

	Opcional fallback: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD.

3. Aplicar cambios de variables y desplegar.
4. Si es necesario crear tablas y seed en produccion:

```bash
npm run db:init
```

5. Verificar URL publica y documentacion:

	- URL publica: https://fsm2miniblog-production.up.railway.app
	- Swagger UI: https://fsm2miniblog-production.up.railway.app/api-docs/ 

## Registro de uso de IA

Se utilizo asistencia de IA para:

- Diagnostico de errores de entorno y deploy en Railway.
- Guia de pruebas de endpoints en Swagger.
- Recomendaciones de cobertura de testing y cierre de documentacion.

Las decisiones finales de implementacion, validacion y ejecucion fueron verificadas manualmente en el proyecto.