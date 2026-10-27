const router = require('express').Router();
const c = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getServices); // public: anyone can view services
router.post('/', protect, authorize('admin'), c.createService);
router.put('/:id', protect, authorize('admin'), c.updateService);
router.delete('/:id', protect, authorize('admin'), c.deleteService);

module.exports = router;
