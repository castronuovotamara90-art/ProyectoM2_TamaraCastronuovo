const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);

app.get('/docs', (req, res) => {
  res.redirect('/api-docs/');
});

app.get('/swagger', (req, res) => {
  res.redirect('/api-docs/');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    message: 'Blog API',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts',
      docs: '/api-docs/',
      docs_alias_1: '/docs',
      docs_alias_2: '/swagger',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
