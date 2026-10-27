const router = require('express').Router();
const { getStaff } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getStaff);

module.exports = router;
