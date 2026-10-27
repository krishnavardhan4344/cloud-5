const mongoose = require('mongoose');

const CATEGORIES = ['Room Service', 'Housekeeping', 'Laundry', 'Food', 'Maintenance', 'Transport', 'Amenities'];

const hotelServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: [true, 'Service name is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  category: { type: String, enum: CATEGORIES, required: [true, 'Category is required'] },
  price: { type: Number, default: 0, min: 0 },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('HotelService', hotelServiceSchema);
