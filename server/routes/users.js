const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:username', getProfile);
router.put('/me/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;