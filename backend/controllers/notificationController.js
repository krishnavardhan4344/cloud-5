const Notification = require('../models/Notification');

// GET /api/notifications   (own notifications)
exports.getNotifications = async (req, res, next) => {
  try {
    res.json(await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50));
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
  try {
    const note = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Notification not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
};
