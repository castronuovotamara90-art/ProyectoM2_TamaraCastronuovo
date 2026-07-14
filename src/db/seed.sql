-- Seed de datos de ejemplo (idempotente)
INSERT INTO authors (name, email, bio)
VALUES
  ('Ana Garcia', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor tecnico especializado en bases de datos'),
  ('Maria Lopez', 'maria@example.com', 'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    bio = EXCLUDED.bio;

INSERT INTO posts (title, content, author_id, published)
SELECT
  'Introduccion a Node.js',
  'Node.js es un runtime de JavaScript...',
  a.id,
  true
FROM authors a
WHERE a.email = 'ana@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p
    WHERE p.title = 'Introduccion a Node.js' AND p.author_id = a.id
  );

INSERT INTO posts (title, content, author_id, published)
SELECT
  'PostgreSQL vs MySQL',
  'Ambas bases de datos tienen ventajas...',
  a.id,
  true
FROM authors a
WHERE a.email = 'carlos@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p
    WHERE p.title = 'PostgreSQL vs MySQL' AND p.author_id = a.id
  );

INSERT INTO posts (title, content, author_id, published)
SELECT
  'APIs RESTful',
  'REST es un estilo arquitectonico...',
  a.id,
  true
FROM authors a
WHERE a.email = 'ana@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p
    WHERE p.title = 'APIs RESTful' AND p.author_id = a.id
  );

INSERT INTO posts (title, content, author_id, published)
SELECT
  'Manejo de errores en Express',
  'El manejo apropiado de errores...',
  a.id,
  false
FROM authors a
WHERE a.email = 'maria@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p
    WHERE p.title = 'Manejo de errores en Express' AND p.author_id = a.id
  );

INSERT INTO posts (title, content, author_id, published)
SELECT
  'Async/Await explicado',
  'Las promesas simplifican el codigo asincrono...',
  a.id,
  false
FROM authors a
WHERE a.email = 'ana@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p
    WHERE p.title = 'Async/Await explicado' AND p.author_id = a.id
  );
