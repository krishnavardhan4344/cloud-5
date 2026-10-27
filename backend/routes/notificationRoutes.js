const router = require('express').Router();
const c = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', c.getNotifications);
router.put('/:id/read', c.markRead);

module.exports = router;
