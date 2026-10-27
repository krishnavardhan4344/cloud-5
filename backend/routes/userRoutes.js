const router = require('express').Router();
const c = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin'), c.getUsers);
router.post('/', authorize('admin'), c.createUser);
router.get('/:id', c.getUser);
router.put('/:id', c.updateUser);
router.delete('/:id', authorize('admin'), c.deleteUser);

module.exports = router;
