const Feedback = require('../models/Feedback');

// POST /api/feedback   (guest)
exports.createFeedback = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const feedback = await Feedback.create({
      guestId: req.user._id,
      rating,
      comment: req.body.comment,
    });
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback   (admin: all, guest: own)
exports.getFeedback = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { guestId: req.user._id };
    const list = await Feedback.find(filter)
      .populate('guestId', 'name roomNumber')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
