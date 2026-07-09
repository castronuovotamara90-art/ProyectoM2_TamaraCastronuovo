const express = require('express');
const authorsController = require('../controllers/authorsController');
const validateRequest = require('../middlewares/validateRequest');
const {
	validateIdParam,
	validateCreateAuthor,
	validateUpdateAuthor,
	normalizeAuthorEmail,
} = require('../middlewares/requestValidators');

const router = express.Router();

router.get('/', authorsController.getAuthors);
router.get('/search', authorsController.searchAuthors);
router.get('/ordered', authorsController.getAuthorsOrdered);
router.get('/:id', validateIdParam('id'), authorsController.getAuthorById);
router.post(
	'/',
	validateRequest(['name', 'email']),
	validateCreateAuthor,
	normalizeAuthorEmail,
	authorsController.createAuthor
);
router.put(
	'/:id',
	validateIdParam('id'),
	validateUpdateAuthor,
	normalizeAuthorEmail,
	authorsController.updateAuthor
);
router.delete('/:id', validateIdParam('id'), authorsController.deleteAuthor);

module.exports = router;
