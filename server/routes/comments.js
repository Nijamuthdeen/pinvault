const router = require('express').Router();
const { getByPost, create, remove } = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.get('/post/:postId', getByPost);
router.post('/post/:postId', auth, create);
router.delete('/:id', auth, remove);

module.exports = router;