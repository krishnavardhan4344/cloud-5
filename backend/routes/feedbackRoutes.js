const router = require('express').Router();
const c = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('guest'), c.createFeedback);
router.get('/', authorize('guest', 'admin'), c.getFeedback);

module.exports = router;
