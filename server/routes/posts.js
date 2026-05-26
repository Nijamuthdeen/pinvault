const router = require('express').Router();
const ctrl = require('../controllers/postController');
const { auth, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, ctrl.getAll);
router.get('/saved', auth, ctrl.getSaved);
router.get('/:id', optionalAuth, ctrl.getOne);
router.post('/', auth, upload.single('image'), ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.post('/:id/like', auth, ctrl.like);
router.post('/:id/save', auth, ctrl.save);

module.exports = router;