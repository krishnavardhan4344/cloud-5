const router = require('express').Router();
const c = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('guest'), c.createRequest);
router.get('/', c.getRequests);
router.get('/:id', c.getRequest);
router.put('/:id/assign', authorize('admin'), c.assignRequest);
router.put('/:id', c.updateRequest);
router.delete('/:id', authorize('admin'), c.deleteRequest);

module.exports = router;
