const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  comment: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
