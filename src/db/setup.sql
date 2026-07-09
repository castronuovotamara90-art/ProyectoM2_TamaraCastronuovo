-- Tabla de autores
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo (idempotente por email/title+author)
INSERT INTO authors (name, email, bio)
VALUES
  ('Ana Garcia', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor tecnico especializado en bases de datos'),
  ('Maria Lopez', 'maria@example.com', 'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published)
SELECT 'Introduccion a Node.js', 'Node.js es un runtime de JavaScript...', 1, true
WHERE EXISTS (SELECT 1 FROM authors WHERE id = 1)
  AND NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'Introduccion a Node.js' AND author_id = 1
  );

INSERT INTO posts (title, content, author_id, published)
SELECT 'PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true
WHERE EXISTS (SELECT 1 FROM authors WHERE id = 2)
  AND NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'PostgreSQL vs MySQL' AND author_id = 2
  );

INSERT INTO posts (title, content, author_id, published)
SELECT 'APIs RESTful', 'REST es un estilo arquitectonico...', 1, true
WHERE EXISTS (SELECT 1 FROM authors WHERE id = 1)
  AND NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'APIs RESTful' AND author_id = 1
  );

INSERT INTO posts (title, content, author_id, published)
SELECT 'Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false
WHERE EXISTS (SELECT 1 FROM authors WHERE id = 3)
  AND NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'Manejo de errores en Express' AND author_id = 3
  );

INSERT INTO posts (title, content, author_id, published)
SELECT 'Async/Await explicado', 'Las promesas simplifican el codigo asincrono...', 1, false
WHERE EXISTS (SELECT 1 FROM authors WHERE id = 1)
  AND NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'Async/Await explicado' AND author_id = 1
  );
