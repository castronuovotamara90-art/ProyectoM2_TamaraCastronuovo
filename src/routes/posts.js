const express = require('express');
const postsController = require('../controllers/postsController');
const validateRequest = require('../middlewares/validateRequest');
const {
  validateIdParam,
  validatePublishedQuery,
  validateCreatePost,
  validateUpdatePost,
} = require('../middlewares/requestValidators');

const router = express.Router();

router.get('/', validatePublishedQuery, postsController.getPosts);
router.get('/author/:authorId', validateIdParam('authorId'), postsController.getPostsByAuthor);
router.get('/:id', validateIdParam('id'), postsController.getPostById);
router.post(
  '/',
  validateRequest(['title', 'content', 'author_id']),
  validateCreatePost,
  postsController.createPost
);
router.put('/:id', validateIdParam('id'), validateUpdatePost, postsController.updatePost);
router.delete('/:id', validateIdParam('id'), postsController.deletePost);

module.exports = router;
